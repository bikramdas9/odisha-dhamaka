import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from unittest.mock import AsyncMock, MagicMock


def make_mock_db():
    db = MagicMock()

    def make_collection():
        col = MagicMock()
        col.count_documents = AsyncMock(return_value=16)
        col.insert_many = AsyncMock()
        col.insert_one = AsyncMock(return_value=MagicMock(inserted_id="abc123"))
        col.find_one = AsyncMock(return_value=None)
        col.update_one = AsyncMock(return_value=MagicMock(matched_count=1))

        cursor = MagicMock()
        cursor.to_list = AsyncMock(return_value=[])
        cursor.sort = MagicMock(return_value=cursor)
        col.find = MagicMock(return_value=cursor)
        return col

    db.menu_items = make_collection()
    db.orders = make_collection()
    db.contacts = make_collection()
    return db


@pytest_asyncio.fixture
async def client():
    mock_db = make_mock_db()

    # Patch DB connect/disconnect and seed so startup doesn't fail
    import unittest.mock as mock
    with mock.patch("app.database.connect_db", new=AsyncMock()), \
         mock.patch("app.database.close_db", new=AsyncMock()), \
         mock.patch("app.seed.seed_menu", new=AsyncMock()):

        from app.main import app
        from app.database import get_db

        # Override the FastAPI dependency so every endpoint gets mock_db
        app.dependency_overrides[get_db] = lambda: mock_db

        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
            yield ac, mock_db

        app.dependency_overrides.clear()
