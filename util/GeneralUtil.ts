export function formatDate(date: Date) {
    const options: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    };

    return date.toLocaleTimeString(undefined, options);
}

export function getRandomEmoji() {
    const emojis = ['😀', '😍', '🎉', '👍', '🤔', '🙌', '😎', '🚀', '❤️', '🌈', '🤣', '👏'];

    // Generate a random index within the range of the emoji array length
    const randomIndex = Math.floor(Math.random() * emojis.length);

    // Return the randomly selected emoji
    return emojis[randomIndex];
}
