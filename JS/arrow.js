// For Trending

const track = document.getElementById('cardTrack');
const scrollAmount = 280; 

if (track && document.getElementById('scrollRight') && document.getElementById('scrollLeft')) {
  document.getElementById('scrollRight').addEventListener('click', () => {
    track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  });

  document.getElementById('scrollLeft').addEventListener('click', () => {
    track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  });
}

// For Popular

const track1 = document.getElementById('cardTrack1');
const scrollAmount1 = 280; 

if (track1 && document.getElementById('scrollRight1') && document.getElementById('scrollLeft1')) {
  document.getElementById('scrollRight1').addEventListener('click', () => {
    track1.scrollBy({ left: scrollAmount1, behavior: 'smooth' });
  });

  document.getElementById('scrollLeft1').addEventListener('click', () => {
    track1.scrollBy({ left: -scrollAmount1, behavior: 'smooth' });
  });
}

// For Recently added

const track2 = document.getElementById('cardTrack2');
const scrollAmount2 = 280;

if (track2 && document.getElementById('scrollRight2') && document.getElementById('scrollLeft2')) {
  document.getElementById('scrollRight2').addEventListener('click', () => {
    track2.scrollBy({ left: scrollAmount2, behavior: 'smooth' });
  });

  document.getElementById('scrollLeft2').addEventListener('click', () => {
    track2.scrollBy({ left: -scrollAmount2, behavior: 'smooth' });
  });
}

// Account menu

const menuToggle = document.getElementById('menuToggle');
const accountMenu = document.getElementById('accountMenu');
let menuCloseTimer;

function closeAccountMenu() {
  accountMenu.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open account menu');
}

function delayMenuClose() {
  menuCloseTimer = setTimeout(closeAccountMenu, 200);
}

function keepMenuOpen() {
  clearTimeout(menuCloseTimer);
}

menuToggle.addEventListener('click', () => {
  keepMenuOpen();
  const isOpen = accountMenu.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', isOpen);
  menuToggle.setAttribute('aria-label', isOpen ? 'Close account menu' : 'Open account menu');
});

menuToggle.addEventListener('mouseleave', delayMenuClose);
menuToggle.addEventListener('mouseenter', keepMenuOpen);
accountMenu.addEventListener('mouseleave', delayMenuClose);
accountMenu.addEventListener('mouseenter', keepMenuOpen);

// Simple search for cards on the current page
const searchInputs = document.querySelectorAll('.search-bar input');

function searchPageCards(searchText) {
  const cards = document.querySelectorAll('.scroll-card, .movie-card, .mylist-card, .genre-card');
  const text = searchText.trim().toLowerCase();

  let firstMatch = null;

  cards.forEach((card) => {
    const titleElement = card.querySelector('.card-title, h3, h5, h2, .genre-card-title');
    const titleText = (titleElement ? titleElement.textContent : card.textContent).toLowerCase();
    const isMatch = !text || titleText.includes(text);

    card.style.display = isMatch ? '' : 'none';

    if (isMatch && !firstMatch && text) {
      firstMatch = card;
    }
  });

  if (firstMatch && text) {
    firstMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

searchInputs.forEach((input) => {
  input.addEventListener('input', (event) => {
    searchPageCards(event.target.value);
  });

  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      searchPageCards(event.target.value);
    }
  });
});

// Basic movie pagination
const moviePagination = document.querySelector('.movie-pagination');
const movieCategories = document.querySelectorAll('.movie-category[data-movie-page]');

if (moviePagination && movieCategories.length) {
  const pageItems = moviePagination.querySelectorAll('.page-item');
  let currentMoviePage = 1;

  function showMoviePage(page) {
    currentMoviePage = page;

    movieCategories.forEach((category) => {
      category.classList.toggle('d-none', Number(category.dataset.moviePage) !== currentMoviePage);
    });

    pageItems.forEach((item) => {
      const pageLink = item.querySelector('[data-page]');
      if (pageLink) {
        const isActive = Number(pageLink.dataset.page) === currentMoviePage;
        item.classList.toggle('active', isActive);
        pageLink.toggleAttribute('aria-current', isActive);
      }
    });

    moviePagination.querySelector('[data-page-action="previous"]').parentElement.classList.toggle('disabled', currentMoviePage === 1);
    moviePagination.querySelector('[data-page-action="next"]').parentElement.classList.toggle('disabled', currentMoviePage === movieCategories.length);
  }

  moviePagination.addEventListener('click', (event) => {
    const clickedLink = event.target.closest('a');
    if (!clickedLink) return;

    event.preventDefault();
    const requestedPage = clickedLink.dataset.page;
    const action = clickedLink.dataset.pageAction;
    const nextPage = requestedPage ? Number(requestedPage) : currentMoviePage + (action === 'next' ? 1 : -1);

    if (nextPage >= 1 && nextPage <= movieCategories.length) {
      showMoviePage(nextPage);
      moviePagination.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });

  showMoviePage(currentMoviePage);
}

// Add shared viewing preferences to every settings modal.
const settingsModal = document.getElementById('settingsModal');
const settingsLanguage = document.getElementById('settingsLanguage');

if (settingsModal && settingsLanguage) {
  const settingsBody = settingsModal.querySelector('.modal-body');

  function addSelectSetting(id, label, options) {
    const row = document.createElement('div');
    row.className = 'settings-row';
    row.innerHTML = `<label class="form-label" for="${id}">${label}</label><select class="form-select" id="${id}">${options.map((option) => `<option>${option}</option>`).join('')}</select>`;
    settingsBody.insertBefore(row, settingsBody.children[1]);
  }

  function addSwitchSetting(id, label, description, checked = false) {
    const row = document.createElement('div');
    row.className = 'settings-row d-flex justify-content-between align-items-center';
    row.innerHTML = `<div><strong>${label}</strong><p class="small text-white-50 mb-0">${description}</p></div><div class="form-check form-switch"><input class="form-check-input" type="checkbox" id="${id}"${checked ? ' checked' : ''}><label class="visually-hidden" for="${id}">${label}</label></div>`;
    settingsBody.appendChild(row);
  }

  addSelectSetting('settingsQuality', 'Video quality', ['Auto (recommended)', '1080p Full HD', '720p HD', '480p']);
  addSelectSetting('settingsSubtitles', 'Subtitle language', ['English', 'Hindi', 'Japanese', 'Off']);
  addSwitchSetting('previewsSetting', 'Autoplay previews', 'Play previews while browsing');
  addSwitchSetting('motionSetting', 'Reduce motion', 'Use fewer animations across AniVault');
}

// Shared Bootstrap authentication modals for every page with a login button.
if (document.querySelector('[data-bs-target="#loginModal"]')) {
  document.body.insertAdjacentHTML('beforeend', `
    <div class="modal fade auth-modal" id="loginModal" tabindex="-1" aria-labelledby="loginModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <div><h2 class="modal-title fs-4 mb-1" id="loginModalLabel">Welcome back</h2><p class="small mb-0 text-white-50">Continue your AniVault journey</p></div>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close login form"></button>
          </div>
          <form>
            <div class="modal-body">
              <div class="input-group mb-3"><span class="input-group-text"><i class="fa-regular fa-envelope"></i></span><div class="form-floating flex-grow-1"><input class="form-control" id="loginEmail" type="email" placeholder="Email address" required><label for="loginEmail">Email address</label></div></div>
              <div class="input-group mb-3"><span class="input-group-text"><i class="fa-solid fa-lock"></i></span><div class="form-floating flex-grow-1"><input class="form-control" id="loginPassword" type="password" placeholder="Password" required><label for="loginPassword">Password</label></div></div>
              <div class="d-flex justify-content-between align-items-center mb-4"><div class="form-check"><input class="form-check-input" id="rememberLogin" type="checkbox"><label class="form-check-label small" for="rememberLogin">Remember me</label></div><a class="auth-link small" href="#">Forgot password?</a></div>
              <button class="btn btn-violet w-100" type="submit">Log in <i class="fa-solid fa-arrow-right ms-1"></i></button>
            </div>
            <div class="modal-footer justify-content-center border-secondary"><span class="small text-white-50">New to AniVault?</span><button class="btn btn-link auth-link p-0" type="button" data-bs-toggle="modal" data-bs-target="#signupModal">Create an account</button></div>
          </form>
        </div>
      </div>
    </div>
    <div class="modal fade auth-modal" id="signupModal" tabindex="-1" aria-labelledby="signupModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <div><h2 class="modal-title fs-4 mb-1" id="signupModalLabel">Create your account</h2><p class="small mb-0 text-white-50">Build your personal anime library</p></div>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close signup form"></button>
          </div>
          <form>
            <div class="modal-body">
              <div class="form-floating mb-3"><input class="form-control" id="signupName" type="text" placeholder="Full name" required><label for="signupName">Full name</label></div>
              <div class="form-floating mb-3"><input class="form-control" id="signupEmail" type="email" placeholder="Email address" required><label for="signupEmail">Email address</label></div>
              <div class="row g-3 mb-3"><div class="col-sm-6"><div class="form-floating"><input class="form-control" id="signupPassword" type="password" placeholder="Password" required><label for="signupPassword">Password</label></div></div><div class="col-sm-6"><div class="form-floating"><input class="form-control" id="signupConfirm" type="password" placeholder="Confirm password" required><label for="signupConfirm">Confirm password</label></div></div></div>
              <div class="form-check mb-4"><input class="form-check-input" id="termsSignup" type="checkbox" required><label class="form-check-label small" for="termsSignup">I agree to the AniVault terms and privacy policy.</label></div>
              <button class="btn btn-violet w-100" type="submit">Create account <i class="fa-solid fa-user-plus ms-1"></i></button>
            </div>
            <div class="modal-footer justify-content-center border-secondary"><span class="small text-white-50">Already a member?</span><button class="btn btn-link auth-link p-0" type="button" data-bs-toggle="modal" data-bs-target="#loginModal">Log in instead</button></div>
          </form>
        </div>
      </div>
    </div>`);
}