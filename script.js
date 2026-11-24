(function(){
  // Scroll progress bar
  var bar = document.getElementById('progressBar');
  var kop = document.getElementById('masthead');
  var hero = document.getElementById('top');
  function tick(){
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    var p = max > 0 ? (h.scrollTop / max) : 0;
    // Voorbij de hero wordt de kop een vaste balk
    kop.classList.toggle('vast', h.scrollTop > hero.offsetHeight - 70);
    bar.style.transform = 'scaleX(' + p.toFixed(4) + ')';
  }
  document.addEventListener('scroll', tick, {passive:true});
  window.addEventListener('resize', tick);
  tick();

  // Section tone-shift via IntersectionObserver
  var masthead = document.getElementById('masthead');
  var chapters = document.querySelectorAll('section.chapter[data-chapter]');
  if ('IntersectionObserver' in window && masthead) {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if (e.isIntersecting) {
          var tone = e.target.getAttribute('data-tone') || 'cream';
          masthead.setAttribute('data-tone', tone);
        }
      });
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
    chapters.forEach(function(c){ io.observe(c); });
  }

  // Year
  var y = document.getElementById('yr');
  if (y) y.textContent = new Date().getFullYear();

  // Contactformulier — via FormSubmit
  var cf = document.getElementById('contactForm');
  if (cf) {
    var knop = cf.querySelector('button[type=submit]');
    var ok = document.getElementById('formOk');
    knop.disabled = false;
    cf.addEventListener('submit', function(e){
      e.preventDefault();
      var err = document.getElementById('formError');
      err.hidden = true; err.textContent = ''; ok.hidden = true;

      var naam = cf.naam.value.trim();
      var email = cf.email.value.trim();
      var tel = cf.telefoon.value.trim();
      var bericht = cf.bericht.value.trim();

      var errs = [];
      if (!naam) errs.push('Vul uw naam in.');
      if (!email && !tel) errs.push('Vul minimaal uw e-mailadres óf telefoonnummer in.');
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.push('Het e-mailadres lijkt niet geldig.');
      if (!bericht) errs.push('Schrijf even een bericht.');
      if (errs.length) {
        err.textContent = errs.join(' ');
        err.hidden = false;
        return;
      }

      if (cf._honey.value) return;

      knop.disabled = true; knop.textContent = 'Bezig met versturen, dit kan even duren…';
      var data = { naam: naam, telefoon: tel, bericht: bericht,
        _subject: 'Bericht van ' + naam + ' via landhart.nl', _template: 'table' };
      if (email) data.email = email;

      // referrerPolicy: FormSubmit wil weten van welke site het bericht komt;
      // de rest van de site geeft die niet door.
      var stop = new AbortController();
      var klok = setTimeout(function(){ stop.abort(); }, 90000);
      fetch('https://formsubmit.co/ajax/info@landhart.nl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        referrerPolicy: 'strict-origin',
        signal: stop.signal,
        body: JSON.stringify(data)
      }).then(function(r){
        return r.json().then(function(j){
          if (!r.ok || String(j.success) !== 'true') throw new Error(j.message);
          cf.reset();
          ok.textContent = 'Bedankt, uw bericht is verstuurd. Wij nemen contact met u op.';
          ok.hidden = false;
        });
      }).catch(function(){
        err.textContent = 'Wij konden niet bevestigen dat uw bericht is verstuurd. Bel 06 33 01 20 35 of mail naar info@landhart.nl. Uw tekst staat er nog.';
        err.hidden = false;
      }).then(function(){
        clearTimeout(klok);
        knop.disabled = false; knop.textContent = 'Verstuur bericht';
      });
    });
  }
})();
