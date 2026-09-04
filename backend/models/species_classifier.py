import torch
import open_clip
from PIL import Image
import io
import os

# ── Load BioCLIP model once at startup ──────────────────
print("🔄 Loading BioCLIP model...")

model, preprocess_train, preprocess_val = open_clip.create_model_and_transforms(
    'hf-hub:imageomics/bioclip'
)
tokenizer = open_clip.get_tokenizer('hf-hub:imageomics/bioclip')
model.eval()

# Use GPU if available
device = "cuda" if torch.cuda.is_available() else "cpu"
model = model.to(device)
print(f"✅ BioCLIP loaded on {device.upper()}")

# ── Common species labels for zero-shot classification ──
SPECIES_LABELS = [
    # Mammals
    "a photo of a lion", "a photo of a tiger", "a photo of an elephant",
    "a photo of a leopard", "a photo of a cheetah", "a photo of a wolf",
    "a photo of a bear", "a photo of a deer", "a photo of a fox",
    "a photo of a snow leopard", "a photo of a red panda",
    "a photo of a giant panda", "a photo of a gorilla",
    "a photo of a chimpanzee", "a photo of an orangutan",
    "a photo of a jaguar", "a photo of a rhinoceros",
    "a photo of a hippopotamus", "a photo of a giraffe",
    "a photo of a zebra", "a photo of a kangaroo", "a photo of a koala",
    "a photo of a platypus", "a photo of a bat", "a photo of a hedgehog",
    "a photo of a mongoose", "a photo of a meerkat", "a photo of a hyena",
    "a photo of a wild boar", "a photo of a bison",

    # Birds
    "a photo of an eagle", "a photo of an owl", "a photo of a parrot",
    "a photo of a flamingo", "a photo of a penguin", "a photo of a peacock",
    "a photo of a hummingbird", "a photo of a toucan", "a photo of a macaw",
    "a photo of an albatross", "a photo of a pelican", "a photo of a kingfisher",
    "a photo of a woodpecker", "a photo of a crow", "a photo of a sparrow",
    "a photo of a robin", "a photo of a swallow", "a photo of a crane",
    "a photo of a stork", "a photo of a vulture",

    # Reptiles
    "a photo of a cobra", "a photo of a crocodile", "a photo of a chameleon",
    "a photo of a iguana", "a photo of a gecko", "a photo of a komodo dragon",
    "a photo of a sea turtle", "a photo of a tortoise",

    # Amphibians
    "a photo of a frog", "a photo of a toad", "a photo of a salamander",
    "a photo of a tree frog", "a photo of an axolotl",

    # Insects
    "a photo of a mantis", "a photo of a butterfly", "a photo of a bee",
    "a photo of a spider", "a photo of a dragonfly", "a photo of an ant",
    "a photo of a beetle", "a photo of a grasshopper", "a photo of a moth",
    "a photo of a ladybug", "a photo of a firefly", "a photo of a praying mantis",
    "a photo of an orchid mantis",

    # Marine
    "a photo of a dolphin", "a photo of a whale", "a photo of a shark",
    "a photo of a jellyfish", "a photo of an octopus", "a photo of a seahorse",
    "a photo of a clownfish", "a photo of a starfish", "a photo of a coral",
    "a photo of a sea anemone", "a photo of a manta ray",

    # Flowers
    "a photo of a rose", "a photo of a sunflower", "a photo of an orchid",
    "a photo of a lotus", "a photo of a tulip", "a photo of a daisy",
    "a photo of a lavender", "a photo of a jasmine", "a photo of a marigold",
    "a photo of a hibiscus", "a photo of a lily", "a photo of a violet",
    "a photo of a wildflower", "a photo of a purple wildflower",
    "a photo of a linaria flower", "a photo of a lupine flower",
    "a photo of a snapdragon flower", "a photo of a foxglove flower",
    "a photo of a bluebell flower", "a photo of a poppy",
    "a photo of a dandelion", "a photo of a bougainvillea",
    "a photo of a water lily", "a photo of a bird of paradise flower",

    # Trees and Plants
    "a photo of a cactus", "a photo of a mushroom", "a photo of a fern",
    "a photo of a moss", "a photo of a bamboo", "a photo of a mangrove",
    "a photo of a baobab tree", "a photo of a sequoia tree",
    "a photo of a venus flytrap", "a photo of a pitcher plant",
    "a photo of a bonsai tree", "a photo of a palm tree",

    # Endangered / Notable Species
    "a photo of a blue whale", "a photo of a mountain gorilla",
    "a photo of a amur leopard", "a photo of a sumatran tiger",
    "a photo of a vaquita porpoise", "a photo of a black rhino",
    "a photo of a pangolin", "a photo of a sea otter",
    "a photo of a california condor", "a photo of a kakapo parrot",
]

# Tokenize labels once
text_tokens = tokenizer(SPECIES_LABELS).to(device)

def validate_image(image_bytes: bytes) -> bool:
    try:
        img = Image.open(io.BytesIO(image_bytes))
        img.verify()
        return True
    except Exception:
        return False

def classify_species(image_bytes: bytes) -> dict:
    try:
        # Load and preprocess image
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        image_tensor = preprocess_val(image).unsqueeze(0).to(device)

        # Run BioCLIP inference
        with torch.no_grad():
            image_features = model.encode_image(image_tensor)
            text_features  = model.encode_text(text_tokens)

            # Normalize
            image_features /= image_features.norm(dim=-1, keepdim=True)
            text_features  /= text_features.norm(dim=-1, keepdim=True)

            # Cosine similarity → probabilities
            similarity = (100.0 * image_features @ text_features.T).softmax(dim=-1)

        # Get top 5 predictions
        values, indices = similarity[0].topk(5)

        predictions = []
        for val, idx in zip(values, indices):
            label = SPECIES_LABELS[idx].replace("a photo of a ", "").replace("an ", "").strip()
            label = label.title()
            predictions.append({
                "species":    label,
                "confidence": round(val.item() * 100, 2),
            })

        return {
            "success":        True,
            "predictions":    predictions,
            "top_species":    predictions[0]["species"],
            "top_confidence": predictions[0]["confidence"],
        }

    except Exception as e:
        return {
            "success":     False,
            "error":       str(e),
            "predictions": []
        }