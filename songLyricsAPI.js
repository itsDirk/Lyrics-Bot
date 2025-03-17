export async function getSongLyrics(artist, songTitle) {
  const response = await fetch(`https://api.lyrics.ovh/v1/${artist}/${songTitle}`);

  if (!response.ok) {
    return `Failed to fetch song lyrics: ${response.statusText}`;
  }

  const data = await response.json();

  if (data.error) {
    return `Failed to fetch song lyrics: ${data.error}`;
  }

  let lyrics = data.lyrics;
  lyrics = lyrics.replace(/\n\n/g, '\n');
  return lyrics;
}