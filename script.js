const gallery = document.getElementById('gallery');
const buttons = document.querySelectorAll('.filter-buttons button');
const modal = document.getElementById('modal');
const modalImg = document.getElementById('modal-img');
const modalCaption = document.getElementById('modal-caption');
const closeBtn = modal.querySelector('.close');
const nextBtn = document.getElementById('nextBtn');

let currentIndex = 0;
let visibleImages = [];

async function loadImages(filter) {
  try {
    switch (filter) {
      case 'team':
        return (await import('./team.js')).teamImages;
      case 'campaigns':
        return (await import('./campaigns.js')).campaignsImages;
      case 'fun':
        return (await import('./fun.js')).funImages;
      case 'bts':
        return (await import('./bts.js')).btsImages;
      case 'face':
        return (await import('./face.js')).faceImages;
      case 'all':
      default:
        const allModules = await Promise.all([
          import('./team.js'),
          import('./campaigns.js'),
          import('./fun.js'),
          import('./bts.js'),
          import('./face.js')
        ]);
        return [
          ...allModules[0].teamImages,
          ...allModules[1].campaignsImages,
          ...allModules[2].funImages,
          ...allModules[3].btsImages,
          ...allModules[4].faceImages
        ];
    }
  } catch (err) {
    console.error('Error loading images:', err);
    return [];
  }
}

function renderGallery(imageData) {
  gallery.innerHTML = '';
  visibleImages = [];

  imageData.forEach((img, index) => {
    const item = document.createElement('div');
    item.className = `item ${img.category}`;
    item.innerHTML = `
      <div class="image-wrapper">
        <img src="${img.src}" alt="${img.alt}" data-index="${index}" />
        <div class="caption">${img.alt}</div>
      </div>
    `;
    gallery.appendChild(item);
  });

  visibleImages = Array.from(document.querySelectorAll('.gallery .item img'));

  visibleImages.forEach(img => {
    img.addEventListener('click', onImageClick);
  });
}


function onImageClick(e) {
  const clickedImg = e.target;
  currentIndex = visibleImages.indexOf(clickedImg);
  if (currentIndex !== -1) {
    openModal(currentIndex);
  }
}

function openModal(index) {
  const img = visibleImages[index];
  if (!img) return;

  currentIndex = index;
  modalImg.src = img.src;
  // modalCaption.textContent = img.alt || '';
  modal.style.display = 'flex';
}


function closeModal() {
  modal.style.display = 'none';
}


function showNextImage() {
  if (visibleImages.length === 0) return;
  currentIndex = (currentIndex + 1) % visibleImages.length;
  const img = visibleImages[currentIndex];
  modalImg.src = img.src;
  modalCaption.textContent = img.alt || '';
}


buttons.forEach(button => {
  button.addEventListener('click', async () => {
    document.querySelector('.filter-buttons .active')?.classList.remove('active');
    button.classList.add('active');

    const filter = button.getAttribute('data-filter');
    const images = await loadImages(filter);
    renderGallery(images);
  });
});


closeBtn.addEventListener('click', closeModal);
nextBtn.addEventListener('click', showNextImage);

modal.addEventListener('click', e => {
  if (e.target === modal) {
    closeModal();
  }
});


loadImages('all').then(renderGallery);
