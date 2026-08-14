document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.demon-list');

  if (!container) {
    console.error('Target container ".demon-list" not found in HTML.');
    return;
  }

  fetch('./levels.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to load levels.json (HTTP ${response.status})`);
      }
      return response.json();
    })
    .then(levels => {
      container.innerHTML = ''; // 清空原本內容

      // 判斷 JSON 是否為空陣列
      if (!Array.isArray(levels) || levels.length === 0) {
        container.innerHTML = `
          <h1 style="text-align: center; color: #8c9ba5; margin-top: 50px;">
            Nothing here yet
          </h1>
        `;
        return;
      }

      // 如果有資料才開始渲染列表
      levels.forEach((level, index) => {
        const rank = level.id || index + 1;
        const thumbnail = level.thumbnail || level.thumbnali || '';
        const videoUrl = level.video_id || '#';
        const isVideoAvailable = level.videoavailable === true && videoUrl !== '#';
        const demonType = level.demontype || 'hard-demon';
        const demonIconPath = `https://gdbrowser.com/assets/difficulties/demon-${demonType}.png`;

        const card = document.createElement('div');
        card.className = 'demon-card';

        card.innerHTML = `
          <!-- Thumbnail & Rank -->
          <div class="thumbnail-container">
            ${thumbnail ? `<img src="${thumbnail}" class="demon-thumbnail" alt="${level.name}">` : '<img src="./tb/NA.png" class="demon-thumbnail">'};
            <div class="rank-badge">#${rank}</div>
          </div>

          <!-- Level Information -->
          <div class="demon-info">
            <h2 class="demon-title">${level.name}</h2>
            <p class="demon-publisher">
              By <strong>${level.creator}</strong>
            </p>
            <p class="demon-publisher" style="font-size: 0.85rem; margin-top: 4px;">
              ID: <a href="https://gdbrowser.com/${level.id_ingame}"><span style="color: #4a9eff;">${level.id_ingame}</span></a>
            </p>
          </div>

          <!-- Meta Section: Demon Face Icon & Video Button -->
          <div class="demon-meta">
            <img src="${demonIconPath}" class="demon-icon" style="width: 45px; height: 45px; object-fit: contain;" alt="${demonType}" onerror="this.style.display='none'">

            ${isVideoAvailable ? `
              <a href="${videoUrl}" target="_blank" class="btn" style="padding: 6px 14px; margin-top: 6px;">
                Watch Run
              </a>
            ` : `
              <span style="font-size: 0.75rem; color: #555; margin-top: 6px;">Video Unavailable</span>
            `}
          </div>
        `;

        container.appendChild(card);
      });
    })
    .catch(error => {
      console.error('Error fetching JSON:', error);
      container.innerHTML = `
        <div style="color: #ff4757; text-align: center; padding: 20px;">
          Failed to load demon list data. Please check your browser console (F12).
        </div>
      `;
    });
});
