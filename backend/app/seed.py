MENU_ITEMS = [
    {"id": 1, "name": "Dalma", "category": "curry", "price": 149, "veg": True,
     "desc": "Classic Odia lentil and vegetable curry slow-cooked with panch phoron", "emoji": "🍲", "bestseller": True},
    {"id": 2, "name": "Macha Besara", "category": "curry", "price": 219, "veg": False,
     "desc": "Fish cooked in a pungent mustard-poppy seed paste with raw mango", "emoji": "🐟", "bestseller": True},
    {"id": 3, "name": "Chhena Poda", "category": "sweets", "price": 129, "veg": True,
     "desc": "Baked caramelised cottage cheese cake — Odisha's pride, Lord Jagannath's favourite", "emoji": "🧀", "bestseller": True},
    {"id": 4, "name": "Pakhala Bhata", "category": "rice", "price": 99, "veg": True,
     "desc": "Fermented rice soaked overnight, served with badi, saga, raw onion and pickle", "emoji": "🍚", "bestseller": False},
    {"id": 5, "name": "Rasabali", "category": "sweets", "price": 110, "veg": True,
     "desc": "Flattened fried cottage cheese patties soaked in sweetened, condensed milk", "emoji": "🍮", "bestseller": True},
    {"id": 6, "name": "Dahi Bara Aloo Dum", "category": "snacks", "price": 89, "veg": True,
     "desc": "Soft urad dal fritters dunked in whisked yoghurt and spicy potato gravy", "emoji": "🫙", "bestseller": True},
    {"id": 7, "name": "Odia Thali", "category": "thali", "price": 249, "veg": True,
     "desc": "Complete meal: rice, dal, dalma, 2 sabji, chutney, papad and dessert", "emoji": "🥘", "bestseller": False},
    {"id": 8, "name": "Non-Veg Thali", "category": "thali", "price": 299, "veg": False,
     "desc": "Rice, fish curry, chicken/mutton, dal, sabji and sweet", "emoji": "🍱", "bestseller": False},
    {"id": 9, "name": "Macha Jhola", "category": "curry", "price": 199, "veg": False,
     "desc": "Everyday Odia fish curry in turmeric and panch phoron gravy", "emoji": "🐠", "bestseller": False},
    {"id": 10, "name": "Aloo Potala Rasa", "category": "curry", "price": 129, "veg": True,
     "desc": "Potato and pointed gourd in a light, tangy tomato gravy", "emoji": "🥔", "bestseller": False},
    {"id": 11, "name": "Mudhi Mixture", "category": "snacks", "price": 59, "veg": True,
     "desc": "Puffed rice tossed with onion, tomato, green chilli, mustard oil and spices", "emoji": "🫘", "bestseller": False},
    {"id": 12, "name": "Bara", "category": "snacks", "price": 79, "veg": True,
     "desc": "Crispy deep-fried urad dal fritters, served with coconut-coriander chutney", "emoji": "🫓", "bestseller": False},
    {"id": 13, "name": "Rasagola", "category": "sweets", "price": 80, "veg": True,
     "desc": "Soft, spongy cottage cheese balls in light sugar syrup — Odisha's origin claim", "emoji": "🍡", "bestseller": False},
    {"id": 14, "name": "Santula", "category": "curry", "price": 109, "veg": True,
     "desc": "Healthy mixed vegetable preparation with minimal oil and gentle spicing", "emoji": "🥦", "bestseller": False},
    {"id": 15, "name": "Chingudi Malai Curry", "category": "curry", "price": 269, "veg": False,
     "desc": "Prawns in a rich coconut-milk gravy with whole garam masala", "emoji": "🦐", "bestseller": True},
    {"id": 16, "name": "Khichdi Prasad", "category": "rice", "price": 119, "veg": True,
     "desc": "Temple-style moong dal khichdi with ghee — simple, sacred and satisfying", "emoji": "🍛", "bestseller": False},
]


async def seed_menu(db):
    count = await db.menu_items.count_documents({})
    if count == 0:
        await db.menu_items.insert_many(MENU_ITEMS)
