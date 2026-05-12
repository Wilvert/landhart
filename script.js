(function(){
  // Scroll progress bar
  var bar = document.getElementById('progressBar');
  function tick(){
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    var p = max > 0 ? (h.scrollTop / max) : 0;
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

  // Contact form — mailto compose
  var cf = document.getElementById('contactForm');
  if (cf) {
    cf.addEventListener('submit', function(e){
      e.preventDefault();
      var err = document.getElementById('formError');
      err.hidden = true; err.textContent = '';

      var naam = cf.naam.value.trim();
      var email = cf.email.value.trim();
      var tel = cf.telefoon.value.trim();
      var bericht = cf.bericht.value.trim();

      var errs = [];
      if (!naam) errs.push('Vul je naam in.');
      if (!email && !tel) errs.push('Vul minimaal je e-mailadres &oacute;f telefoonnummer in.');
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.push('Het e-mailadres lijkt niet geldig.');
      if (!bericht) errs.push('Schrijf even een bericht.');
      if (errs.length) {
        err.innerHTML = errs.join(' ');
        err.hidden = false;
        return;
      }

      var subject = 'Bericht van ' + naam + ' — landhart.nl';
      var bodyLines = ['Naam: ' + naam];
      if (email) bodyLines.push('E-mail: ' + email);
      if (tel) bodyLines.push('Telefoon: ' + tel);
      bodyLines.push('', 'Bericht:', bericht);

      var href = 'mailto:info@landhart.nl?subject=' + encodeURIComponent(subject) +
                 '&body=' + encodeURIComponent(bodyLines.join('\n'));
      window.location.href = href;
    });
  }
})();
