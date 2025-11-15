(function(){
  'use strict';

  // Year in footer
  var yearEl = document.getElementById('year');
  if(yearEl){ yearEl.textContent = new Date().getFullYear(); }

  // Products data
  var products = [
    { id: 'aerorescue', name: 'aerorescue', role: 'Emergency medical drone', priceLakhs: 1.3, img: 'assets/img/drones/aerorescue.svg', aiImg: 'https://image.pollinations.ai/prompt/futuristic%20ai%20generated%20medical%20rescue%20drone%2C%20VTOL%2C%20thermal%20camera%2C%20high%20detail%2C%20studio%20lighting?width=800&height=600', desc: 'Built for rapid first response with a secure medical payload bay, thermal imaging, and VTOL for tight landing zones.', features: ['Thermal camera payload', 'VTOL for tight zones', 'Encrypted telemetry'] },
    { id: 'areodeliver', name: 'areodeliver', role: 'Logistics & delivery', priceLakhs: 1.8, img: 'assets/img/drones/areodeliver.svg', aiImg: 'https://image.pollinations.ai/prompt/ai%20generated%20autonomous%20delivery%20drone%2C%20cargo%20bay%2C%20modern%20city%20background%2C%20high%20detail?width=800&height=600', desc: 'Medium‑range autonomous delivery platform with route optimization, geofencing, and weather‑aware flight planning.', features: ['Autonomous routing', 'Geo‑fence safety', 'Weather aware flight'] },
    { id: 'areoagro', name: 'areoagro', role: 'Agriculture', priceLakhs: 2.2, img: 'assets/img/drones/areoagro.svg', aiImg: 'https://image.pollinations.ai/prompt/ai%20generated%20agriculture%20spraying%20drone%20over%20fields%2C%20multispectral%20sensors%2C%20sunset%2C%20cinematic?width=800&height=600', desc: 'Precision spraying, multispectral crop health mapping, and field‑safe low‑altitude flight automation.', features: ['Precision spray system', 'Multispectral mapping', 'Terrain following'] },
    { id: 'aerosurvey', name: 'aerosurvey', role: 'Survey & mapping', priceLakhs: 2.5, img: 'assets/img/drones/aerosurvey.svg', aiImg: 'https://image.pollinations.ai/prompt/ai%20generated%20survey%20mapping%20drone%2C%20RTK%20GNSS%2C%20topographic%20grid%2C%20photogrammetry%2C%20ultra%20detailed?width=800&height=600', desc: 'RTK‑enabled photogrammetry, long endurance, and centimeter‑grade terrain modeling.', features: ['RTK GNSS', 'Photogrammetry', '90‑min endurance'] },
    { id: 'aeroguard', name: 'aeroguard', role: 'Defense/security', priceLakhs: 2.8, img: 'assets/img/drones/aeroguard.svg', aiImg: 'https://image.pollinations.ai/prompt/ai%20generated%20defense%20security%20drone%2C%20rugged%20frame%2C%20night%20security%20scene%2C%20cinematic%20lighting?width=800&height=600', desc: 'Encrypted communications, ruggedized airframe, and modular ISR payloads for perimeter security.', features: ['Encrypted comms', 'Ruggedized frame', 'ISR payload support'] }
  ];

  // Placeholder image (inline SVG) used if a product image is missing
  var placeholder = 'data:image/svg+xml;utf8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">\n' +
    '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#2ea0ff"/><stop offset="100%" stop-color="#5be1ff"/></linearGradient></defs>\n' +
    '<rect width="800" height="600" fill="#0a1228"/>\n' +
    '<circle cx="400" cy="300" r="180" fill="none" stroke="url(#g)" stroke-width="12" opacity="0.7"/>\n' +
    '<text x="50%" y="50%" fill="#b7c5e6" font-size="36" font-family="Segoe UI, Roboto, Arial" dominant-baseline="middle" text-anchor="middle">Drone Image</text>\n' +
    '</svg>'
  );

  // Render products
  var grid = document.getElementById('product-grid');
  if(grid){
    grid.innerHTML = products.map(function(p){
      return [
        '<article class="card" id="', p.id ,'">',
          '<img class="card-img" loading="lazy" referrerpolicy="no-referrer" src="', escapeHtml(p.img || ''), '" data-ai-src="', escapeHtml(p.aiImg || ''), '" alt="', capitalize(p.name), ' image" onerror="this.src=\'', placeholder ,'\';this.onerror=null;">',
          '<h3>', capitalize(p.name) ,'</h3>',
          '<p class="role">', escapeHtml(p.role) ,'</p>',
          '<div class="price">₹', formatLakhs(p.priceLakhs), ' lakhs</div>',
          (Array.isArray(p.features) ? '<ul class="features">' + p.features.map(function(f){return '<li>' + escapeHtml(f) + '</li>';}).join('') + '</ul>' : ''),
          '<p>', escapeHtml(p.desc) ,'</p>',
          '<div class="actions">',
            '<a class="btn btn-primary" href="#contact" aria-label="Enquire about ', capitalize(p.name) ,'">Enquire</a>',
          '</div>',
        '</article>'
      ].join('');
    }).join('');

    // Progressive enhancement: upgrade to AI image if online and it loads
    var imgs = grid.querySelectorAll('img.card-img[data-ai-src]');
    imgs.forEach(function(img){
      var ai = img.getAttribute('data-ai-src');
      if(!ai || !navigator.onLine) return;
      var test = new Image();
      test.referrerPolicy = 'no-referrer';
      test.onload = function(){ img.src = ai; };
      test.onerror = function(){ /* keep local image */ };
      test.src = ai;
    });
  }

  // Smooth focus on skip to main when using hash links
  if(location.hash){
    var target = document.querySelector(location.hash);
    if(target){ target.setAttribute('tabindex','-1'); target.focus(); }
  }

  // Contact form handling (mailto)
  var form = document.getElementById('contact-form');
  var feedback = document.getElementById('form-feedback');
  if(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var data = new FormData(form);
      var name = (data.get('name') || '').toString().trim();
      var email = (data.get('email') || '').toString().trim();
      var phone = (data.get('phone') || '').toString().trim();
      var message = (data.get('message') || '').toString().trim();

      if(!name || !email || !message){
        setFeedback('Please fill in your name, email, and message.', true);
        return;
      }

      var subject = encodeURIComponent('Enquiry — Horizon Scout');
      var bodyLines = [
        'Name: ' + name,
        'Email: ' + email,
        (phone ? 'Phone: ' + phone : ''),
        '',
        message
      ].filter(Boolean);

      var body = encodeURIComponent(bodyLines.join('\n'));
      var mailto = 'mailto:sales@horizonscout.example?subject=' + subject + '&body=' + body;

      // Try opening the mail client
      try {
        window.location.href = mailto;
        setFeedback('Your email client should open. If not, copy the details from your message and email us at sales@horizonscout.example.', false);
        form.reset();
      } catch(_err){
        setFeedback('Could not open your email client. Please email us at sales@horizonscout.example.', true);
      }
    });
  }

  // Utils
  function capitalize(str){ return (str||'').charAt(0).toUpperCase() + (str||'').slice(1); }
  function formatLakhs(n){ return Number(n).toLocaleString('en-IN', { maximumFractionDigits: 1 }); }
  function setFeedback(msg, isError){ if(!feedback) return; feedback.style.color = isError ? '#ff6b6b' : 'var(--accent)'; feedback.textContent = msg; }
  function escapeHtml(s){
    return (s+'').replace(/[&<>"]+/g, function(ch){
      return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[ch]);
    });
  }
})();

