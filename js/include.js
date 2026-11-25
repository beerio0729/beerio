document.addEventListener('DOMContentLoaded', async () => {
    const targets = document.querySelectorAll('[data-include]');

    await Promise.all([...targets].map(async (el) => {
        try {
            const res = await fetch(el.dataset.include, { cache: 'no-cache' });
            if (!res.ok) throw new Error(res.status);
            el.outerHTML = await res.text();
        } catch (err) {
            console.error('โหลดไม่ได้:', el.dataset.include, err);
        }
    }));

    // โหลด script.js หลัง section ทั้งหมดเข้าหน้าแล้ว
    const s = document.createElement('script');
    s.src = 'js/script.js';
    document.body.appendChild(s);
});
