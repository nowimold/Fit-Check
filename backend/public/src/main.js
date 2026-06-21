import { getOrCreateUserId } from './lib/identity.js';
import { fetchTodayChecklist, toggleChecklistItem } from './lib/api.js';

const apiBaseUrl = window.__FIT_CHECK_API_BASE_URL__ || window.location.origin;

function getEncouragementClass(encouragement) {
  if (!encouragement) return 'warning';
  if (encouragement.message.includes('3일')) return 'celebration';
  if (encouragement.message.includes('완벽')) return 'success';
  return 'warning';
}

function formatDate(dateStr) {
  const date = new Date(dateStr + 'T00:00:00');
  const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' };
  return date.toLocaleDateString('ko-KR', options);
}

function renderChecklist(container, data, userId) {
  const completedCount = data.items.filter(item => item.isDone).length;
  const totalCount = data.items.length;
  const progressPercent = (completedCount / totalCount) * 100;

  const encouragementClass = getEncouragementClass(data.encouragement);

  const itemsHtml = data.items.length
    ? data.items.map((item) => `
        <div class="checklist-item ${item.isDone ? 'done' : ''}">
          <label>
            <div class="checkbox-wrapper">
              <input 
                type="checkbox" 
                data-item-id="${item.id}" 
                ${item.isDone ? 'checked' : ''} 
              />
            </div>
            <span class="item-text">${item.itemText}</span>
          </label>
        </div>
      `).join('')
    : '<div class="error">오늘은 아직 항목이 없어요.</div>';

  container.innerHTML = `
    <div class="encouragement ${encouragementClass}">
      <p class="encouragement-text">
        ${data.encouragement ? data.encouragement.message : '화이팅!'}
      </p>
    </div>
    <div class="checklist">
      ${itemsHtml}
    </div>
    <div class="progress">
      <div class="progress-label">진행률</div>
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${progressPercent}%"></div>
      </div>
      <div class="progress-text">${completedCount} / ${totalCount} 완료</div>
    </div>
  `;

  container.querySelectorAll('input[type="checkbox"]').forEach((input) => {
    input.addEventListener('change', async (event) => {
      const target = event.currentTarget;
      const itemId = target.dataset.itemId;
      try {
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
      } catch (error) {
        target.checked = !target.checked;
        console.error('체크 실패:', error);
      }
    });
  });
}

async function bootstrap() {
  const container = document.querySelector('#content');
  const dateDisplay = document.querySelector('#today-date');
  
  try {
    const userId = getOrCreateUserId(window.localStorage, window.crypto.randomUUID.bind(window.crypto));
    const today = new Date().toISOString().slice(0, 10);
    
    dateDisplay.textContent = formatDate(today);
    
    const data = await fetchTodayChecklist({
      baseUrl: apiBaseUrl,
      userId,
      date: today
    });

    renderChecklist(container, data, userId);
  } catch (error) {
    container.innerHTML = `<div class="error">앱을 불러올 수 없습니다: ${error.message}</div>`;
  }
}

bootstrap();
