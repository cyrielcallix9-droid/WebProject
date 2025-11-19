const shoes = [
    { id: 1, image: 'one.jfif' },
    { id: 2, image: 'two.jfif' },
    { id: 3, image: 'three.jfif' },
    { id: 4, image: 'four.jfif' },
];

const mainImage = document.querySelector('.shoe-image');
const icons = document.querySelectorAll('.icon');

function updateImage(shoeId) {
    if (!mainImage) {
        return;
    }

    const selectedShoe = shoes.find((shoe) => shoe.id === shoeId);
    if (!selectedShoe) {
        return;
    }

    mainImage.src = selectedShoe.image;

    icons.forEach((icon) => icon.classList.remove('active'));

    const activeIcon = document.querySelector(`[data-shoe="${shoeId}"]`);
    if (activeIcon) {
        activeIcon.classList.add('active');
    }
}

icons.forEach((icon) => {
    icon.addEventListener('click', () => {
        const shoeId = parseInt(icon.getAttribute('data-shoe'), 10);
        updateImage(shoeId);
    });
});

updateImage(1);
