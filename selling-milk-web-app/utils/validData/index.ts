export function validateURLAvatar(url: string | undefined | null) {
    if (!url || url.trim() === "") {
        return "/images/avatar)1.jpg"
    }

    try {
        new URL(url)
        return url
    } catch (err) {
        return "/images/avatar_1.jpg"
    }
}

export function validateURLProduct(url: string | undefined | null) {
    if (!url || url.trim() === "") {
        return "/images/product_1.png"
    }

    try {
        new URL(url)
        return url
    } catch (err) {
        return "/images/product_1.png"
    }
}

export function isValidUrl(url: string | undefined | null) {
    if (!url || url.trim() === "") {
        return false
    }

    try {
        new URL(url);
    } catch (_) {
        return false;
    }

    return true;
}