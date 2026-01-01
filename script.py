import requests
from bs4 import BeautifulSoup
import json

urls = [
"https://open.spotify.com/track/7pE1xKtppOzWhs67lFCNAs",
"https://open.spotify.com/track/39LLxExYz6ewLAcYrzQQNy",
"https://open.spotify.com/track/6UelLqGlWMcVH1E5cEiUk",
"https://open.spotify.com/track/4ZtFanR9U6ndgddUvNcjcG",
"https://open.spotify.com/track/5HCyWlXZPP0y6Gqq8TgA20",
"https://open.spotify.com/track/5wANPM4fQCJwkGd4rN57mH",
"https://open.spotify.com/track/4iJyoBOLtHqaGxP12qzhQI",
"https://open.spotify.com/track/1SC5rEoYDGUK4NfG82494W",
"https://open.spotify.com/track/0LThjFY2iTtNdd4wviwVV2",
"https://open.spotify.com/track/2bgTY4UwhfBYhGT4HUYStN",
"https://open.spotify.com/track/0t1kP63rueHleOhQkYSXFY",
"https://open.spotify.com/track/5T8EDUDqKcs6OSOwEsfqG7",
"https://open.spotify.com/track/3tjFYV6RSFtuktYl3ZtYcq",
"https://open.spotify.com/track/4Oun2ylbjFKMPTiaSbbCih",
"https://open.spotify.com/track/21jGcNKet2qwijlDFuPiPb"
]

data_list = []

for url in urls:
    track_id = url.split('/')[-1]
    oembed_url = f"https://open.spotify.com/oembed?url={url}"
    try:
        response = requests.get(oembed_url, timeout=10)
        if response.status_code == 200:
            data = response.json()
            title = data['title']
            thumbnail_url = data['thumbnail_url']
            artist = None
            year = None
            # Get embed
            embed_url = f"https://open.spotify.com/embed/track/{track_id}"
            embed_response = requests.get(embed_url, timeout=10)
            if embed_response.status_code == 200:
                soup = BeautifulSoup(embed_response.text, 'html.parser')
                # Find artist
                artist_link = soup.find('a', href=lambda x: x and '/artist/' in x)
                if artist_link:
                    artist = artist_link.get_text().strip()
                # Find year
                # Look for text with •year•
                text = soup.get_text()
                import re
                year_match = re.search(r'(\d{4})', text)
                if year_match:
                    year = year_match.group(1)
            data_list.append({'track_id': track_id, 'title': title, 'thumbnail': thumbnail_url, 'artist': artist, 'year': year})
        else:
            data_list.append({'track_id': track_id, 'error': 'oembed failed'})
    except Exception as e:
        data_list.append({'track_id': track_id, 'error': str(e)})

with open('spotify_data.json', 'w') as f:
    json.dump(data_list, f, indent=2)

print("Data saved to spotify_data.json")