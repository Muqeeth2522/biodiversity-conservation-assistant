import requests
from fastapi import APIRouter

router = APIRouter()

IUCN_API_URL = "https://apiv3.iucnredlist.org/api/v3"
IUCN_TOKEN   = "9bb4facb6d23f48efbf424bb05c0c1ef1cf6f468e"  # Free public token

STATUS_DESCRIPTIONS = {
    "EX":  ("Extinct",              "🖤", "No known individuals remaining."),
    "EW":  ("Extinct in the Wild",  "⚫", "Survives only in captivity."),
    "CR":  ("Critically Endangered","🔴", "Extremely high risk of extinction."),
    "EN":  ("Endangered",           "🟠", "High risk of extinction in the wild."),
    "VU":  ("Vulnerable",           "🟡", "High risk of endangerment in the wild."),
    "NT":  ("Near Threatened",      "🔵", "Likely to qualify as threatened soon."),
    "LC":  ("Least Concern",        "🟢", "Lowest risk; does not qualify for higher risk."),
    "DD":  ("Data Deficient",       "⚪", "Inadequate information to make an assessment."),
    "NE":  ("Not Evaluated",        "⚪", "Has not yet been evaluated against the criteria."),
}

@router.get("/conservation/{species_name}")
async def get_conservation_status(species_name: str):
    """
    Look up IUCN Red List conservation status for a species.
    """
    try:
        # Clean species name
        clean_name = species_name.strip().replace("_", " ")

        # Query IUCN API
        url = f"{IUCN_API_URL}/species/{clean_name}?token={IUCN_TOKEN}"
        response = requests.get(url, timeout=10)

        if response.status_code == 200:
            data = response.json()
            results = data.get("result", [])

            if results:
                species_data = results[0]
                code = species_data.get("category", "NE")
                status_info = STATUS_DESCRIPTIONS.get(code, STATUS_DESCRIPTIONS["NE"])

                return {
                    "success":      True,
                    "species":      clean_name,
                    "status_code":  code,
                    "status":       status_info[0],
                    "emoji":        status_info[1],
                    "description":  status_info[2],
                    "taxonid":      species_data.get("taxonid"),
                    "kingdom":      species_data.get("kingdom_name"),
                    "phylum":       species_data.get("phylum_name"),
                    "class":        species_data.get("class_name"),
                    "order":        species_data.get("order_name"),
                    "family":       species_data.get("family_name"),
                }
            else:
                return {
                    "success":     True,
                    "species":     clean_name,
                    "status_code": "NE",
                    "status":      "Not Evaluated",
                    "emoji":       "⚪",
                    "description": "Species not found in IUCN database.",
                }
        else:
            return {"success": False, "error": "IUCN API unavailable"}

    except Exception as e:
        return {"success": False, "error": str(e)}