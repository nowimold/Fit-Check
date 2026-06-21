import { getOrCreateUserId } from './lib/identity.js';
import { fetchTodayChecklist, toggleChecklistItem } from './lib/api.js';

const apiBaseUrl = window.__FIT_CHECK_API_BASE_URL__ || window.location.origin;

function renderChecklist(container, data, userId) {
  const itemsHtml = data.items.length
    ? data.items.map((item) => `
        <li>
          <label>
            <input type="checkbox" data-item-id="${item.id}" ${item.isDone ? 'checked' : ''} />
            ${item.itemText}
          </label>
        </li>
      `).join('')
    : '<li>오늘은 아직 항목이 없어요.</li>';

  container.innerHTML = `
    <section>
      <p>${data.encouragement ? data.encouragement.message : ''}</p>
      <ul>${itemsHtml}</ul>
    </section>
  `;

  container.querySelectorAll('input[type="checkbox"]').forEach((input) => {
    input.addEventListener('change', async (event) => {
      const target = event.currentTarget;
      const itemId = target.dataset.itemId;
      const updated = await toggleChecklistItem({
        baseUrl: apiBaseUrl,
        userId,
        itemId,
        date: data.date,
        isDone: target.checked
      });

      data.items = data.items.map((item) => (
        item.id === updated.itemId
          ? { ...item, isDone: updated.isDone }
          : item
      ));
      renderChecklist(container, data, userId);
    });
  });
}

async function bootstrap() {
  const container = document.querySelector('#app');
  const userId = getOrCreateUserId(window.localStorage, window.crypto.randomUUID.bind(window.crypto));
  const data = await fetchTodayChecklist({
    baseUrl: apiBaseUrl,
    userId,
    date: new Date().toISOString().slice(0, 10)
  });

  renderChecklist(container, data, userId);
}

bootstrap().catch((error) => {
  const container = document.querySelector('#app');
  container.textContent = error.message;
});
