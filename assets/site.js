/* =========================================================
   SAINT AUGUSTIN TOURISME & VOYAGES — SHARED SITE SCRIPT
   Handles: language switching, nav dropdowns / mobile menu,
   active link state, accordions, and simple form handling.
   ========================================================= */

/* ---------- SHARED TRANSLATIONS (chrome used on every page) ---------- */
const siteTranslations = {
  fr: {
    nav_home:"Accueil", nav_excursions:"Nos Excursions", nav_tours:"Nos Circuits",
    nav_reservation:"Réservation",
    nav_about:"À Propos", nav_info:"Info", nav_blog:"Blog", nav_contact:"Contact",
    sub_home_1:"Présentation", sub_home_2:"Actualités",
    sub_exc_1:"Excursions Intérieur", sub_exc_2:"Excursions Extérieur", sub_exc_3:"Réservation",
    sub_tours_1:"Circuits en Algérie", sub_tours_2:"Circuits à l'International", sub_tours_3:"Omra", sub_tours_4:"Découverte de l'Afrique du Nord", sub_tours_g1:"Pour les Algériens", sub_tours_g2:"Pour les étrangers",
    sub_about_1:"Notre Histoire", sub_about_2:"Notre Équipe",
    sub_info_1:"Questions Fréquentes", sub_info_2:"Conditions & Tarifs",
    sub_blog_1:"Derniers Articles", sub_blog_2:"Catégories",
    sub_contact_1:"Nous Contacter", sub_contact_2:"Nous Localiser",
    lang_label:"Langue",
    info_phone:"Téléphone :", info_email:"Email :", info_location:"Localisation :",
    strip_text:"Voyagez avec foi, découvrez avec le cœur. ✈",
    footer_about_title:"S.A.T.V.",
    footer_about_text:"Saint Augustin Tourisme & Voyages vous accompagne à travers l'Algérie et au-delà : circuits spirituels et culturels, excursions et séjours sur-mesure, organisés avec sérieux et passion.",
    footer_links_title:"Liens Rapides",
    footer_offers_title:"Nos Offres",
    footer_contact_title:"Contact",
    footer_rights:"Tous droits réservés.",
    btn_discover:"Découvrir",
    btn_reserve:"Réserver",
    btn_send:"Envoyer le message",
    btn_contact:"Nous contacter",
    btn_back_top:"Retour en haut",
    breadcrumb_home:"Accueil",
    book_title:"Réserver votre séjour", book_item_default:"Votre circuit",
    book_last_l:"Nom", book_last_ph:"Votre nom",
    book_first_l:"Prénom", book_first_ph:"Votre prénom",
    book_start_l:"Date de départ", book_return_l:"Date de retour",
    book_persons_l:"Nombre de personnes",
    book_email_l:"Email", book_email_ph:"vous@exemple.com",
    book_phone_l:"Téléphone", book_phone_ph:"06 XX XX XX XX",
    book_submit:"Envoyer ma demande de réservation",
    book_confirm_t:"Merci d'avoir choisi Saint Augustin Agence de Voyage !",
    book_confirm_p:"Votre demande de réservation a bien été reçue. Notre équipe vous contactera très prochainement pour confirmer votre séjour.",
    book_close:"Fermer", book_aria_close:"Fermer",
    detail_reserve:"Réserver cet itinéraire",
    quiz_match:"Correspondance :", quiz_recommended:"Destination recommandée",
    quiz_result_title:"Vos meilleures destinations", quiz_detail:"Voir les détails", quiz_book:"Réserver",
    quiz_title:"Trouvez votre destination idéale", quiz_back:"← Précédent", quiz_restart:"Recommencer ↺", quiz_progress:"Question"
  },
  en: {
    nav_home:"Home", nav_excursions:"Our Excursions", nav_tours:"Our Tours",
    nav_reservation:"Booking",
    nav_about:"About", nav_info:"Info", nav_blog:"Blog", nav_contact:"Contact",
    sub_home_1:"Overview", sub_home_2:"News",
    sub_exc_1:"Domestic Excursions", sub_exc_2:"International Excursions", sub_exc_3:"Reservation",
    sub_tours_1:"Tours in Algeria", sub_tours_2:"International Tours", sub_tours_3:"Umrah", sub_tours_4:"Discover North Africa", sub_tours_g1:"For Algerians", sub_tours_g2:"For foreigners",
    sub_about_1:"Our History", sub_about_2:"Our Team",
    sub_info_1:"FAQ", sub_info_2:"Terms & Pricing",
    sub_blog_1:"Latest Articles", sub_blog_2:"Categories",
    sub_contact_1:"Contact Us", sub_contact_2:"Find Us",
    lang_label:"Language",
    info_phone:"Phone:", info_email:"Email:", info_location:"Location:",
    strip_text:"Travel with faith, discover with heart. ✈",
    footer_about_title:"S.A.T.V.",
    footer_about_text:"Saint Augustin Tourisme & Voyages takes you across Algeria and beyond: spiritual and cultural tours, excursions and tailor-made stays, organized with care and passion.",
    footer_links_title:"Quick Links",
    footer_offers_title:"Our Offers",
    footer_contact_title:"Contact",
    footer_rights:"All rights reserved.",
    btn_discover:"Discover",
    btn_reserve:"Book Now",
    btn_send:"Send Message",
    btn_contact:"Contact Us",
    btn_back_top:"Back to top",
    breadcrumb_home:"Home",
    book_title:"Book your stay", book_item_default:"Your circuit",
    book_last_l:"Last name", book_last_ph:"Your last name",
    book_first_l:"First name", book_first_ph:"Your first name",
    book_start_l:"Start date", book_return_l:"Return date",
    book_persons_l:"Number of people",
    book_email_l:"Email", book_email_ph:"you@example.com",
    book_phone_l:"Phone", book_phone_ph:"06 XX XX XX XX",
    book_submit:"Send my booking request",
    book_confirm_t:"Thank you for choosing Saint Augustin Travel Agency!",
    book_confirm_p:"Your booking request has been received. Our team will contact you very soon to confirm your stay.",
    book_close:"Close", book_aria_close:"Close",
    detail_reserve:"Book this itinerary",
    quiz_match:"Match:", quiz_recommended:"Recommended destination",
    quiz_result_title:"Your best destinations", quiz_detail:"View details", quiz_book:"Book",
    quiz_title:"Find your ideal destination", quiz_back:"← Back", quiz_restart:"Restart ↺", quiz_progress:"Question"
  },
  ar: {
    nav_home:"الرئيسية", nav_excursions:"رحلاتنا", nav_tours:"جولاتنا",
    nav_reservation:"الحجز",
    nav_about:"من نحن", nav_info:"معلومات", nav_blog:"المدونة", nav_contact:"اتصل بنا",
    sub_home_1:"نبذة عنا", sub_home_2:"آخر الأخبار",
    sub_exc_1:"رحلات داخلية", sub_exc_2:"رحلات خارجية", sub_exc_3:"حجز",
    sub_tours_1:"جولات في الجزائر", sub_tours_2:"جولات دولية", sub_tours_3:"عمرة", sub_tours_4:"اكتشف شمال إفريقيا", sub_tours_g1:"للجزائريين", sub_tours_g2:"للأجانب",
    sub_about_1:"تاريخنا", sub_about_2:"فريقنا",
    sub_info_1:"الأسئلة الشائعة", sub_info_2:"الشروط والأسعار",
    sub_blog_1:"أحدث المقالات", sub_blog_2:"التصنيفات",
    sub_contact_1:"اتصل بنا", sub_contact_2:"موقعنا",
    lang_label:"اللغة",
    info_phone:"الهاتف:", info_email:"البريد الإلكتروني:", info_location:"الموقع:",
    strip_text:"سافر بإيمان، واكتشف بقلبك. ✈",
    footer_about_title:"وكالة سانت أوغستان",
    footer_about_text:"ترافقكم وكالة سانت أوغستان للسياحة والأسفار عبر الجزائر وخارجها: جولات روحية وثقافية، رحلات وإقامات مصممة خصيصاً، بجدية وشغف.",
    footer_links_title:"روابط سريعة",
    footer_offers_title:"عروضنا",
    footer_contact_title:"اتصل بنا",
    footer_rights:"جميع الحقوق محفوظة.",
    btn_discover:"اكتشف",
    btn_reserve:"احجز الآن",
    btn_send:"إرسال الرسالة",
    btn_contact:"اتصل بنا",
    btn_back_top:"العودة للأعلى",
    breadcrumb_home:"الرئيسية",
    book_title:"احجز إقامتك", book_item_default:"رحلتك",
    book_last_l:"الاسم", book_last_ph:"اسمك",
    book_first_l:"اللقب", book_first_ph:"لقبك",
    book_start_l:"تاريخ الانطلاق", book_return_l:"تاريخ العودة",
    book_persons_l:"عدد الأشخاص",
    book_email_l:"البريد الإلكتروني", book_email_ph:"you@example.com",
    book_phone_l:"الهاتف", book_phone_ph:"06 XX XX XX XX",
    book_submit:"إرسال طلب الحجز",
    book_confirm_t:"شكراً لاختياركم وكالة سانت أوغستان للسفر!",
    book_confirm_p:"تم استلام طلب الحجز الخاص بكم. سيتواصل معكم فريقنا قريباً لتأكيد إقامتكم.",
    book_close:"إغلاق", book_aria_close:"إغلاق",
    detail_reserve:"احجز هذه الرحلة",
    quiz_match:"التوافق:", quiz_recommended:"الوجهة الموصى بها",
    quiz_result_title:"أفضل الوجهات لك", quiz_detail:"عرض التفاصيل", quiz_book:"احجز",
    quiz_title:"اعثر على وجهتك المثالية", quiz_back:"→ السابق", quiz_restart:"إعادة ↺", quiz_progress:"السؤال"
  }
};

/* Merge page-specific translations (declared as `pageTranslations` on
   individual pages before this script loads) into the shared dictionary. */
function getMergedTranslations(){
  if (typeof pageTranslations === 'undefined') return siteTranslations;
  const merged = { fr:{}, en:{}, ar:{} };
  ['fr','en','ar'].forEach(l=>{
    merged[l] = Object.assign({}, siteTranslations[l], pageTranslations[l] || {});
  });
  return merged;
}

function setLanguage(lang){
  const dict = getMergedTranslations()[lang];
  if(!dict) return;
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const key = el.getAttribute('data-i18n');
    if(dict[key] !== undefined) el.textContent = dict[key];
  });
  document.querySelectorAll('[data-i18n-html]').forEach(el=>{
    const key = el.getAttribute('data-i18n-html');
    if(dict[key] !== undefined) el.innerHTML = dict[key];
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el=>{
    const key = el.getAttribute('data-i18n-placeholder');
    if(dict[key] !== undefined) el.setAttribute('placeholder', dict[key]);
  });
  document.documentElement.setAttribute('lang', lang);
  document.body.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
  document.querySelectorAll('.lang-option').forEach(opt=>{
    opt.classList.toggle('active', opt.getAttribute('data-lang') === lang);
  });
  localStorage.setItem('site-lang', lang);
  window.currentLang = lang;
  if (window._langHandlers) window._langHandlers.forEach(function(fn){ fn(); });
  const langSelect = document.getElementById('langSelect');
  if (langSelect) langSelect.classList.remove('open');
}

document.addEventListener('DOMContentLoaded', function(){

  /* ---------- hero background follows the visitor's local time ----------
     applied on every page so all heroes match the current time.
     05:00–11:59 -> morning, 12:00–17:59 -> afternoon, 18:00–04:59 -> night */
  const HERO_PHASES = ['morning','afternoon','night'];
  function syncHeroTime(){
    const h = new Date().getHours();
    const idx = (h >= 5 && h < 12) ? 0 : (h >= 12 && h < 18) ? 1 : 2;
    const url = "url('assets/hero-" + HERO_PHASES[idx] + ".png')";
    document.documentElement.style.setProperty('--page-hero-img', url);
    document.querySelectorAll('.page-hero').forEach(el=>{
      el.style.backgroundImage =
        "linear-gradient(180deg, rgba(8,17,31,.40) 0%, rgba(13,32,56,.20) 45%, rgba(13,32,56,.65) 100%), " + url;
    });
  }
  syncHeroTime();
  setInterval(syncHeroTime, 60000);

  /* ---------- language switcher ---------- */
  const langSelect = document.getElementById('langSelect');
  const langCurrent = document.getElementById('langCurrent');
  if (langCurrent){
    langCurrent.addEventListener('click', (e)=>{
      e.stopPropagation();
      langSelect.classList.toggle('open');
    });
  }
  document.querySelectorAll('.lang-option').forEach(opt=>{
    opt.addEventListener('click', ()=> setLanguage(opt.getAttribute('data-lang')));
  });
  document.addEventListener('click', ()=>{ if(langSelect) langSelect.classList.remove('open'); });

  setLanguage(localStorage.getItem('site-lang') || 'fr');

  /* ---------- mobile nav toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  if (navToggle && mainNav){
    navToggle.addEventListener('click', (e)=>{
      e.stopPropagation();
      mainNav.classList.toggle('open');
    });
    /* on mobile, tapping a top-level link with a submenu opens the submenu
       instead of navigating, first tap only */
    document.querySelectorAll('#mainNav > ul > li').forEach(li=>{
      const link = li.querySelector(':scope > a');
      const sub = li.querySelector(':scope > .submenu');
      if (sub && link){
        link.addEventListener('click', (e)=>{
          if (window.innerWidth <= 700){
            e.preventDefault();
            li.classList.toggle('sub-open');
          }
        });
      }
    });
  }

  /* ---------- accordion (FAQ pages) ---------- */
  document.querySelectorAll('.acc-q').forEach(q=>{
    q.addEventListener('click', ()=>{
      const item = q.closest('.acc-item');
      const wasOpen = item.classList.contains('open');
      item.parentElement.querySelectorAll('.acc-item').forEach(i=>i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });

  /* ---------- contact form (client-side, opens WhatsApp / mail) ---------- */
  const contactForm = document.getElementById('contactForm');
  if (contactForm){
    contactForm.addEventListener('submit', function(e){
      e.preventDefault();
      const name = document.getElementById('cf-name').value.trim();
      const phone = document.getElementById('cf-phone').value.trim();
      const subject = document.getElementById('cf-subject') ? document.getElementById('cf-subject').value : '';
      const message = document.getElementById('cf-message').value.trim();
      const successBox = document.getElementById('formSuccess');

      const body = `Bonjour S.A.T.V.,%0A%0ANom: ${encodeURIComponent(name)}%0ATéléphone: ${encodeURIComponent(phone)}%0ASujet: ${encodeURIComponent(subject)}%0A%0AMessage:%0A${encodeURIComponent(message)}`;
      const mailto = `mailto:comercial.staugustin@gmail.com?subject=${encodeURIComponent('Demande via le site — ' + (subject || 'Contact'))}&body=${body}`;

      window.location.href = mailto;

      if (successBox){
        successBox.classList.add('show');
        successBox.scrollIntoView({behavior:'smooth', block:'center'});
      }
      contactForm.reset();
    });
  }

  /* ---------- footer year ---------- */
  document.querySelectorAll('.js-year').forEach(el=> el.textContent = new Date().getFullYear());

  /* ---------- mark active nav link based on current page ---------- */
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav a[href]').forEach(a=>{
    const href = a.getAttribute('href');
    if (href === current){
      a.classList.add('active');
      const parentLi = a.closest('li');
      const topLink = parentLi ? parentLi.closest('ul').closest('li')?.querySelector(':scope > a') : null;
    }
  });
  document.querySelectorAll('nav > ul > li').forEach(li=>{
    const sub = li.querySelectorAll('.submenu a');
    sub.forEach(a=>{
      if (a.getAttribute('href') === current){
        li.querySelector(':scope > a').classList.add('active');
      }
    });
  });

  /* ---------- scroll-reveal animations (smooth, "amazed" polish) ---------- */
  const revealTargets = document.querySelectorAll(
    '.card, .section-head, .quote-box, .step, .footer-col, .promo-card, .team-card, .value-card, .faq-item, .price-card'
  );
  revealTargets.forEach((el, idx) => {
    el.classList.add('reveal-init');
    el.style.transitionDelay = (idx % 4) * 70 + 'ms';
  });
  if ('IntersectionObserver' in window){
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if (entry.isIntersecting){
          entry.target.classList.add('reveal-in');
          io.unobserve(entry.target);
        }
      });
    }, {threshold:0.12, rootMargin:'0px 0px -40px 0px'});
    revealTargets.forEach(el => io.observe(el));
  } else {
    revealTargets.forEach(el => el.classList.add('reveal-in'));
  }

  /* ---------- smooth anchor scrolling ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', function(e){
      const id = this.getAttribute('href');
      if (id.length > 1){
        const target = document.querySelector(id);
        if (target){
          e.preventDefault();
          target.scrollIntoView({behavior:'smooth', block:'start'});
        }
      }
    });
  });

  /* ---------- back-to-top button ---------- */
  const backTop = document.createElement('button');
  backTop.className = 'back-top';
  backTop.setAttribute('aria-label','Retour en haut');
  backTop.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 4l-8 8h5v8h6v-8h5z"/></svg>';
  document.body.appendChild(backTop);
  window.addEventListener('scroll', ()=>{
    backTop.classList.toggle('show', window.scrollY > 500);
  });
  backTop.addEventListener('click', ()=> window.scrollTo({top:0, behavior:'smooth'}));

  /* ---------- booking flow (contact.html) ---------- */
  const bookingFlow = document.getElementById('bookingFlow');
  if (bookingFlow){
    const steps = bookingFlow.querySelectorAll('.bstep');
    const panels = bookingFlow.querySelectorAll('.bpanel');
    const chosenDestEl = document.getElementById('chosenDest');
    let chosenDestination = '';
    let chosenPayment = '';

    function goToStep(n){
      steps.forEach(s=>{
        const sn = parseInt(s.dataset.step,10);
        s.classList.toggle('active', sn === n);
        s.classList.toggle('done', sn < n);
      });
      panels.forEach(p=>{
        p.classList.toggle('active', parseInt(p.dataset.panel,10) === n);
      });
      bookingFlow.scrollIntoView({behavior:'smooth', block:'start'});
    }

    bookingFlow.querySelectorAll('#bookingMap .dest-pin').forEach(pin=>{
      pin.addEventListener('click', ()=>{
        chosenDestination = pin.dataset.dest;
        if (chosenDestEl) chosenDestEl.textContent = chosenDestination;
        goToStep(2);
      });
    });

    const confirmYes = document.getElementById('confirmYes');
    const confirmNo = document.getElementById('confirmNo');
    if (confirmYes) confirmYes.addEventListener('click', ()=> goToStep(3));
    if (confirmNo) confirmNo.addEventListener('click', ()=> goToStep(1));

    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm){
      bookingForm.addEventListener('submit', function(e){
        e.preventDefault();
        goToStep(4);
      });
    }

    bookingFlow.querySelectorAll('.pay-card').forEach(card=>{
      card.addEventListener('click', ()=>{
        chosenPayment = card.dataset.pay;
        goToStep(5);
      });
    });

    const bookAgain = document.getElementById('bookAgain');
    if (bookAgain){
      bookAgain.addEventListener('click', ()=>{
        chosenDestination = ''; chosenPayment = '';
        if (bookingForm) bookingForm.reset();
        bookingFlow.querySelectorAll('#bookingMap .dest-pin').forEach(p=>p.classList.remove('active'));
        goToStep(1);
      });
    }
  }

  /* ---------- reservation flow (reservation.html) ---------- */
  const resaFlow = document.getElementById('resaFlow');
  if (resaFlow){
    const hotelsData = {
      annaba:    { label:'Annaba',   flag:'🇩🇿', hotels:[
        {name:'El Mountazah Hôtel', meta:'Annaba — vue mer, 4★'},
        {name:'Sheraton Annaba',    meta:'Annaba — front de mer, 5★'}
      ]},
      constantine:{ label:'Constantine', flag:'🇩🇿', hotels:[
        {name:'Ibis Constantine',   meta:'Constantine — centre-ville, 3★'},
        {name:'Marriott Constantine', meta:'Constantine — vue sur les gorges, 5★'}
      ]},
      tipaza:    { label:'Tipaza',   flag:'🇩🇿', hotels:[
        {name:'Hôtel Matarès',      meta:'Tipaza — bord de mer, 4★'}
      ]},
      kabylie:   { label:'Kabylie (Tizi Ouzou)', flag:'🇩🇿', hotels:[
        {name:'Hôtel Lalla Khedidja', meta:'Tizi Ouzou — vue Djurdjura, 3★'}
      ]},
      ghardaia:  { label:'Ghardaïa', flag:'🇩🇿', hotels:[
        {name:'La Rose des Sables', meta:'Ghardaïa — vallée du M\'Zab, 3★'}
      ]},
      tlemcen:   { label:'Tlemcen',  flag:'🇩🇿', hotels:[
        {name:'Renaissance Tlemcen Hôtel', meta:'Tlemcen — centre-ville, 5★'},
        {name:'Ibis Tlemcen',       meta:'Tlemcen — proche médina, 3★'}
      ]},
      moscou:    { label:'Moscou',   flag:'🇷🇺', hotels:[
        {name:'Red Square Hotel',   meta:'Moscou — Place Rouge, 4★'},
        {name:'Kremlin View Palace', meta:'Moscou — centre historique, 5★'}
      ]},
      tunis:     { label:'Tunis',    flag:'🇹🇳', hotels:[
        {name:'Dar Saïd',           meta:'Sidi Bou Saïd — boutique hôtel, 4★'},
        {name:'Movenpick Gammarth', meta:'Tunis — bord de mer, 5★'}
      ]},
      kairouan:  { label:'Kairouan', flag:'🇹🇳', hotels:[
        {name:'La Kasbah Kairouan', meta:'Kairouan — médina, 4★'}
      ]},
      marrakech: { label:'Marrakech', flag:'🇲🇦', hotels:[
        {name:'La Mamounia',        meta:'Marrakech — palace historique, 5★'}
      ]},
      fes:       { label:'Fès',      flag:'🇲🇦', hotels:[
        {name:'Palais Faraj Suites', meta:'Fès — médina, vue panoramique, 4★'}
      ]},
      istanbul:  { label:'Istanbul', flag:'🇹🇷', hotels:[
        {name:'Ottoman Palace Hotel', meta:'Istanbul — Sultanahmet, 4★'},
        {name:'Bosphorus View Hotel', meta:'Istanbul — vue Bosphore, 5★'}
      ]},
      cappadoce: { label:'Cappadoce', flag:'🇹🇷', hotels:[
        {name:'Cappadocia Cave Suites', meta:'Cappadoce — chambres troglodytes, 4★'}
      ]},
      caire:     { label:'Le Caire', flag:'🇪🇬', hotels:[
        {name:'Marriott Mena House', meta:'Gizeh — vue pyramides, 5★'}
      ]},
      louxor:    { label:'Louxor',   flag:'🇪🇬', hotels:[
        {name:'Sofitel Winter Palace', meta:'Louxor — bord du Nil, 5★'}
      ]},
      grenade:   { label:'Grenade',  flag:'🇪🇸', hotels:[
        {name:'Alhambra Palace Hôtel', meta:'Grenade — vue Alhambra, 5★'}
      ]},
      seville:   { label:'Séville',  flag:'🇪🇸', hotels:[
        {name:'Hôtel Alfonso XIII',  meta:'Séville — centre historique, 5★'}
      ]},
      makkah:    { label:'La Mecque', flag:'🇸🇦', hotels:[
        {name:'Hilton Suites Makkah', meta:'La Mecque — proche Haram, 5★'}
      ]},
      madina:    { label:'Médine',   flag:'🇸🇦', hotels:[
        {name:'Pullman Zamzam Madina', meta:'Médine — proche Haram, 5★'}
      ]},
      bakou:     { label:'Bakou',    flag:'🇦🇿', hotels:[
        {name:'Baku Old City Hotel', meta:'Bakou — vieille ville, 4★'},
        {name:'Flame Towers Suites', meta:'Bakou — vue tours de feu, 5★'}
      ]}
    };

    const resaPanels = resaFlow.querySelectorAll('.resa-panel');
    let lastMapPanel = 'interieur'; // remembers whether to return to interieur or exterieur map

    function showResaPanel(name){
      resaPanels.forEach(p => p.classList.toggle('active', p.dataset.panel === name));
      if (name === 'exterieur' && window.__externMap){
        setTimeout(()=>{
          window.__externMap.invalidateSize();
          if (window.__externBounds) window.__externMap.fitBounds(window.__externBounds, {padding:[30,30]});
        }, 80);
      }
      resaFlow.scrollIntoView({behavior:'smooth', block:'start'});
    }

    resaFlow.querySelectorAll('.choice-card').forEach(card=>{
      card.addEventListener('click', ()=>{
        const choice = card.dataset.choice;
        lastMapPanel = choice;
        showResaPanel(choice);
      });
    });

    resaFlow.querySelectorAll('.resa-back[data-back]').forEach(btn=>{
      btn.addEventListener('click', ()=> showResaPanel(btn.dataset.back));
    });

    const hotelsBack = document.getElementById('hotelsBack');
    if (hotelsBack) hotelsBack.addEventListener('click', ()=> showResaPanel(lastMapPanel));

    resaFlow.querySelectorAll('.offer-reserve').forEach(btn=>{
      btn.addEventListener('click', ()=> openResaModal(btn.dataset.hotel, btn.dataset.city));
    });

    const IMG_POOL = ['assets/hotels/h1.jpg','assets/hotels/h2.jpg','assets/hotels/h3.jpg','assets/hotels/h4.jpg','assets/hotels/h5.jpg','assets/hotels/h6.jpg','assets/hotels/h7.jpg','assets/hotels/h8.jpg','assets/hotels/h9.jpg','assets/hotels/h10.jpg'];

    function openHotels(cityKey){
      const data = hotelsData[cityKey];
      if (!data) return;
      const titleEl = document.getElementById('hotelsCityTitle');
      const listEl = document.getElementById('hotelsList');
      if (titleEl) titleEl.textContent = data.flag + ' Hôtels — ' + data.label;
      if (listEl){
        listEl.innerHTML = data.hotels.map((h,idx)=>`
          <div class="hotel-card">
            <div class="hotel-card-photo">
              <img class="hotel-photo" src="${h.img || IMG_POOL[idx % IMG_POOL.length]}" alt="${h.name}" onerror="this.style.display='none';">
              <div class="hotel-info">
                <h4>${h.name}</h4>
                <p>${h.meta}</p>
                <button type="button" class="btn small reserve-btn" data-hotel="${h.name}" data-city="${data.label}">Réserver →</button>
              </div>
            </div>
          </div>`).join('');
        listEl.querySelectorAll('.reserve-btn').forEach(btn=>{
          btn.addEventListener('click', ()=> openResaModal(btn.dataset.hotel, btn.dataset.city));
        });
      }
      showResaPanel('hotels');
    }

    resaFlow.querySelectorAll('.dest-pin[data-city]').forEach(pin=>{
      pin.addEventListener('click', ()=> openHotels(pin.dataset.city));
    });

    /* ---- interactive geographic map for "extérieur" (toute la zone) ---- */
    const externMapEl = document.getElementById('externMap');
    if (externMapEl && window.L){
      const EXTERN_POS = {
        moscou:[55.7558,37.6173], tunis:[36.8065,10.1815], kairouan:[35.6781,10.0961],
        marrakech:[31.6295,-7.9811], fes:[34.0331,-5.0003], istanbul:[41.0082,28.9784],
        cappadoce:[38.6437,34.8300], caire:[30.0444,31.2357], louxor:[25.6872,32.6396],
        grenade:[37.1773,-3.5986], seville:[37.3891,-5.9845], makkah:[21.3891,39.8579],
        madina:[24.5247,39.5692], bakou:[40.4093,49.8671]
      };
      const extMap = L.map('externMap', {scrollWheelZoom:false});
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
        attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom:18
      }).addTo(extMap);
      const pinIconGold = new L.Icon({iconUrl:'assets/pin-gold.svg', iconSize:[24,30], iconAnchor:[12,30], popupAnchor:[0,-28]});
      const markerBounds = [];
      Object.keys(EXTERN_POS).forEach(key=>{
        const c = hotelsData[key];
        if (!c) return;
        const marker = L.marker(EXTERN_POS[key], {icon: pinIconGold}).addTo(extMap);
        markerBounds.push(EXTERN_POS[key]);
        marker.bindPopup('<strong style="font-size:13px;">'+c.flag+' '+c.label+'</strong>');
        marker.on('click', ()=> openHotels(key));
      });
      const bounds = L.latLngBounds(markerBounds);
      try { extMap.fitBounds(bounds, {padding:[30,30]}); } catch(e){ extMap.setView([40,14], 4); }
      window.__externMap = extMap;
      window.__externBounds = bounds;
    }

    /* ---- reservation & payment modal (Edahabia / CIB) ---- */
    const resaOverlay = document.getElementById('resaModal');
    const resaForm = document.getElementById('resaForm');
    const confBox = document.getElementById('resaConfirm');
    const resaHotel = document.getElementById('resaHotel');
    const cardFields = document.getElementById('cardFields');
    const payCards = document.querySelectorAll('.pay-card');
    let selectedPay = 'edahabia';

    function openResaModal(hotel, city){
      if (confBox) confBox.classList.remove('show');
      if (resaForm) resaForm.style.display = '';
      if (resaHotel) resaHotel.textContent = 'Hôtel : ' + hotel + (city ? ' — ' + city : '');
      if (cardFields && selectedPay !== 'edahabia') cardFields.classList.remove('show');
      if (resaOverlay) resaOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    payCards.forEach(card=>{
      card.addEventListener('click', ()=>{
        payCards.forEach(c=>c.classList.remove('active'));
        card.classList.add('active');
        selectedPay = card.dataset.pay;
        if (cardFields) cardFields.classList.toggle('show', selectedPay === 'cib');
      });
    });

    if (resaForm) resaForm.addEventListener('submit', (e)=>{
      e.preventDefault();
      if (resaForm) resaForm.style.display = 'none';
      if (confBox) confBox.classList.add('show');
    });

    window.closeResaModal = function(){
      if (resaOverlay) resaOverlay.classList.remove('open');
      document.body.style.overflow = '';
      if (resaForm) resaForm.reset();
      if (confBox) confBox.classList.remove('show');
      if (cardFields) cardFields.classList.remove('show');
    };
    const resaCloseBtn = document.getElementById('resaClose');
    if (resaCloseBtn) resaCloseBtn.addEventListener('click', closeResaModal);
    if (resaOverlay) resaOverlay.addEventListener('click', (e)=>{ if (e.target === resaOverlay) closeResaModal(); });
  }

  /* ---------- destination map switcher (excursions-exterieur.html) ---------- */
  const destMap = document.getElementById('destMap');
  if (destMap){
    const pins = destMap.querySelectorAll('.dest-pin');
    const panels = destMap.querySelectorAll('[data-panel]');
    pins.forEach(pin=>{
      pin.addEventListener('click', ()=>{
        const country = pin.dataset.country;
        pins.forEach(p=>p.classList.toggle('active', p === pin));
        panels.forEach(panel=>{
          const match = panel.dataset.panel === country;
          panel.hidden = !match;
          if (panel.dataset.panel === 'intro') panel.hidden = true;
        });
      });
    });
  }
});

/* =========================================================================
   GLOBAL BOOKING MODAL — used on circuits & excursions pages.
   Any element with [data-book] opens the booking form with that item preselected.
   ========================================================================= */
(function(){
  if (document.getElementById('bookModal')) return;

  const template = `
  <div class="modal-overlay" id="bookModal">
    <div class="modal-box">
      <button type="button" class="modal-close" id="bookClose" aria-label="Fermer">&times;</button>

      <form id="bookForm">
        <h3 class="modal-title" data-i18n="book_title">Réserver votre séjour</h3>
        <p class="modal-sub" id="bookItem"></p>

        <div class="card-row">
          <div class="field">
            <label for="bookLast" data-i18n="book_last_l">Nom</label>
            <input type="text" id="bookLast" name="last" required placeholder="Votre nom" data-i18n-placeholder="book_last_ph">
          </div>
          <div class="field">
            <label for="bookFirst" data-i18n="book_first_l">Prénom</label>
            <input type="text" id="bookFirst" name="first" required placeholder="Votre prénom" data-i18n-placeholder="book_first_ph">
          </div>
        </div>
        <div class="card-row">
          <div class="field">
            <label for="bookStart" data-i18n="book_start_l">Date de départ</label>
            <input type="date" id="bookStart" name="startDate" required>
          </div>
          <div class="field">
            <label for="bookReturn" data-i18n="book_return_l">Date de retour</label>
            <input type="date" id="bookReturn" name="returnDate" required>
          </div>
        </div>
        <div class="field">
          <label for="bookEmail" data-i18n="book_email_l">Email</label>
          <input type="email" id="bookEmail" name="email" required placeholder="vous@exemple.com" data-i18n-placeholder="book_email_ph">
        </div>
        <div class="field">
          <label for="bookPhone" data-i18n="book_phone_l">Téléphone</label>
          <input type="tel" id="bookPhone" name="phone" required placeholder="06 XX XX XX XX" data-i18n-placeholder="book_phone_ph">
        </div>
        <div class="field">
          <label for="bookPersons" data-i18n="book_persons_l">Nombre de personnes</label>
          <input type="number" id="bookPersons" name="persons" min="1" max="99" value="1" required>
        </div>

        <button type="submit" class="btn btn-pay" data-i18n="book_submit">Envoyer ma demande de réservation</button>
      </form>

      <div class="resa-confirm" id="bookConfirm">
        <div class="check">✓</div>
        <h3 data-i18n="book_confirm_t">Merci d'avoir choisi Saint Augustin Agence de Voyage !</h3>
        <p data-i18n="book_confirm_p">Votre demande de réservation a bien été reçue. Notre équipe vous contactera très prochainement pour confirmer votre séjour.</p>
        <br>
        <button type="button" class="btn" onclick="closeBook()" data-i18n="book_close">Fermer</button>
      </div>
    </div>
  </div>`;

  document.body.insertAdjacentHTML('beforeend', template);

  var overlay = document.getElementById('bookModal');
  var form = document.getElementById('bookForm');
  var itemEl = document.getElementById('bookItem');
  var confirmBox = document.getElementById('bookConfirm');
  var cardFields = document.getElementById('bookCardFields');
  var selectedPay = 'edahabia';

  overlay.querySelectorAll('.pay-card').forEach(function(btn){
    btn.addEventListener('click', function(){
      overlay.querySelectorAll('.pay-card').forEach(function(c){ c.classList.remove('active'); });
      btn.classList.add('active');
      selectedPay = btn.dataset.pay;
      if (cardFields) cardFields.classList.toggle('show', selectedPay === 'cib');
    });
  });

  form.addEventListener('submit', function(e){
    e.preventDefault();
    var token = localStorage.getItem('satv_token');
    var btn = form.querySelector('button[type="submit"]');
    if (btn){ btn.disabled = true; }

    var payload = {
      offer_name: lastBookItem || t('book_item_default'),
      type: 'circuit',
      travel_date: form.bookStart ? form.bookStart.value : '',
      people: form.bookPersons ? Number(form.bookPersons.value || 1) : 1,
      contact_name: ((form.bookFirst ? form.bookFirst.value : '') + ' ' + (form.bookLast ? form.bookLast.value : '')).trim(),
      contact_email: form.bookEmail ? form.bookEmail.value : '',
      contact_phone: form.bookPhone ? form.bookPhone.value : '',
    };

    function showConfirm(){
      form.style.display = 'none';
      if (confirmBox) confirmBox.classList.add('show');
      if (btn) btn.disabled = false;
    }

    // If not logged in, just show the confirmation (previously the modal
    // already redirected to login in openBook, but be safe).
    if (!token){
      showConfirm();
      return;
    }

    fetch('/api/reservations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
      body: JSON.stringify(payload),
    })
      .then(function(res){
        if (!res.ok){ throw new Error('HTTP ' + res.status); }
        return res.json();
      })
      .then(showConfirm)
      .catch(function(){
        showConfirm(); // still reassure the visitor even if save fails
      });
  });

  var lastBookItem = null, lastBookSub = null;

  function translateBookingItem(item, sub){
    var L = currentLang();
    var match = null;
    if (item){
      var DETAILS = window.DETAILS || {};
      for (var slug in DETAILS){
        var d = DETAILS[slug];
        if (d && d.fr && (d.fr.book === item || d.fr.title === item)){ match = d; break; }
      }
    }
    var out = match
      ? (match[L] && match[L].book ? match[L].book : item)
      : (item || t('book_item_default'));
    if (sub && match && match[L] && match[L].sub) sub = match[L].sub;
    return out + (sub ? ' — ' + sub : '');
  }

  window.openBook = function(item, sub){
    if (!localStorage.getItem('satv_token')) {
      try { localStorage.setItem('satv_redirect', window.location.href); } catch(e){}
      window.location.href = 'login.html';
      return;
    }
    lastBookItem = item; lastBookSub = sub;
    if (form) form.style.display = '';
    if (confirmBox) confirmBox.classList.remove('show');
    if (cardFields) cardFields.classList.remove('show');
    renderBookItem();
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  function currentLang(){ return window.currentLang || 'fr'; }
  function t(key){
    var d = getMergedTranslations()[currentLang()];
    return (d && d[key] !== undefined) ? d[key] : key;
  }
  function renderBookItem(){
    if (!itemEl) return;
    itemEl.textContent = translateBookingItem(lastBookItem, lastBookSub);
  }
  window._langHandlers = window._langHandlers || [];
  window._langHandlers.push(function(){
    if (overlay.classList.contains('open')) renderBookItem();
  });

  window.closeBook = function(){
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    if (form) form.reset();
    if (confirmBox) confirmBox.classList.remove('show');
    if (cardFields) cardFields.classList.remove('show');
  };

  document.getElementById('bookClose').addEventListener('click', closeBook);
  overlay.addEventListener('click', function(e){ if (e.target === overlay) closeBook(); });

  document.querySelectorAll('[data-book]').forEach(function(btn){
    btn.addEventListener('click', function(){
      openBook(btn.dataset.book, btn.dataset.bookSub);
    });
  });

  document.querySelectorAll('.reserve-btn').forEach(function(btn){
    btn.addEventListener('click', function(){
      var item = btn.dataset.book;
      var sub = btn.dataset.bookSub;
      if (!item && btn.closest('.card')){
        var title = btn.closest('.card').querySelector('h3, .card-body h4');
        item = title ? title.textContent.trim() : 'Votre séjour';
      }
      openBook(item, sub);
    });
  });
})();

/* =========================================================================
   DETAIL MODAL — "Voir les détails" : photo + history of each circuit/excursion.
   Any element with [data-detail] opens it with the matching slug in DETAILS.
   ========================================================================= */
(function(){
  var DETAILS = {
    /* ------- Circuits en Algérie ------- */
    'decouverte-algerie-2026': {
      img:'promo/pic-cirta.jpg',
      fr:{ title:'Découverte de l’Algérie 🇩🇿', sub:'Voyageurs internationaux · Itinéraires accompagnés', book:'Découverte de l’Algérie',
        text:"L’Algérie offre au voyageur international un patrimoine unique : les ruines romaines de Timgad et de Djemila, la Casbah d’Alger, la basilique Saint-Augustin d’Annaba et les grands espaces du Sahara. Nos circuits accompagnés sont conçus pour les visiteurs étrangers : guides francophones et anglophones, logistique et assistance du départ à l’arrivée.",
        info:["🏛️ Ruines romaines UNESCO","🕌 Casbah & patrimoine","⛪ Itinéraire Saint-Augustin","🏜️ Sahara & Tassili","🗣️ Guides FR / EN"],
        program:[
          {t:'🗺️', h:'Pourquoi l’Algérie ?', d:'Un patrimoine mondial encore préservé : Timgad, Djemila, la Casbah d’Alger, Tipaza, le M’Zab et le Tassili n’Ajjer.\nDes sites rares et peu fréquentés, loin des foules.\nUn accueil chaleureux et une histoire qui traverse les civilisations romaine, berbère, arabe et ottomane.'},
          {t:'🧭', h:'Nos itinéraires recommandés', d:'Sur les Traces des Saints : Alger, Mostaganem, Tlemcen, Oran.\nLa Route du Grand Sud : Ghardaïa, Timimoun, le Sahara.\nCirta – Constantine : visites historiques et ponts spectaculaires.\nLe Grand Tour : Annaba (Saint-Augustin), Constantine, Timgad, Djemila.'},
          {t:'🤝', h:'Pensé pour les visiteurs étrangers', d:'Guides francophones et anglophones.\nPrise en charge aéroport (arrivée à Alger).\nLogistique, hébergement et transports organisés.\nInformations visa et formalités sur demande.'},
          {t:'📞', h:'Réservation & information', d:'Saint Augustin Travel\n☎️ 0554 67 89 21\n☎️ 0669 00 21 18\n✉️ comercial.staugustin@gmail.com'}
        ] },
      en:{ title:'Discover Algeria 🇩🇿', sub:'International travelers · Guided itineraries', book:'Discover Algeria',
        text:"Algeria offers the international traveler a unique heritage: the Roman ruins of Timgad and Djemila, the Casbah of Algiers, the Saint Augustine Basilica of Annaba and the wide open spaces of the Sahara. Our guided circuits are designed for foreign visitors: French and English speaking guides, logistics and assistance from departure to arrival.",
        info:["🏛️ UNESCO Roman ruins","🕌 Casbah & heritage","⛪ Saint Augustine route","🏜️ Sahara & Tassili","🗣️ FR / EN guides"],
        program:[
          {t:'🗺️', h:'Why Algeria?', d:'A world heritage that is still preserved: Timgad, Djemila, the Casbah of Algiers, Tipaza, the M’Zab and the Tassili n’Ajjer.\nRare and little-visited sites, far from the crowds.\nA warm welcome and a history spanning the Roman, Berber, Arab and Ottoman civilizations.'},
          {t:'🧭', h:'Our recommended itineraries', d:'In the Footsteps of the Saints: Algiers, Mostaganem, Tlemcen, Oran.\nRoute of the Deep South: Ghardaïa, Timimoun, the Sahara.\nCirta – Constantine: historical visits and spectacular bridges.\nThe Grand Tour: Annaba (Saint Augustine), Constantine, Timgad, Djemila.'},
          {t:'🤝', h:'Designed for foreign visitors', d:'French and English speaking guides.\nAirport pick-up (arrival in Algiers).\nOrganized logistics, accommodation and transport.\nVisa and formalities information on request.'},
          {t:'📞', h:'Reservation & information', d:'Saint Augustin Travel\n☎️ 0554 67 89 21\n☎️ 0669 00 21 18\n✉️ comercial.staugustin@gmail.com'}
        ] },
      ar:{ title:'اكتشف الجزائر 🇩🇿', sub:'المسافرون الدوليون · مسارات بمرافقة', book:'اكتشف الجزائر',
        text:"تقدّم الجزائر للمسافر الدولي تراثاً فريداً: أطلال تيمقاد وجميلة الرومانية، قصبة الجزائر، بازيليك القديس أوغسطينوس بعنابة، وفسيح الصحراء الكبرى. صُممت جولاتنا المرافقة خصيصاً للزوار الأجانب: مرشدون ناطقون بالفرنسية والإنجليزية، مع لوجستيك ومساعدة من الانطلاق إلى الوصول.",
        info:["🏛️ أطلال رومانية يونسكو","🕌 القصبة والتراث","⛪ مسار سانت أوغسطين","🏜️ الصحراء وطاسيلي","🗣️ مرشدون فر/إن"],
        program:[
          {t:'🗺️', h:'لماذا الجزائر؟', d:'تراث عالمي ما زال محفوظاً: تيمقاد، جميلة، قصبة الجزائر، تيبازة، وادي مزاب وطاسيلي ناجر.\nمواقع نادرة وقليلة الزيارات، بعيدة عن الازدحام.\nحفاوة وترحيب وتاريخ يمرّ بالحضارات الرومانية والأمازيغية والعربية والعثمانية.'},
          {t:'🧭', h:'مساراتنا الموصى بها', d:'على خطى الأولياء: الجزائر العاصمة، مستغانم، تلمسان، وهران.\nطريق الجنوب الكبير: غرداية، تيميمون، الصحراء.\nسيرتا – قسنطينة: جولات تاريخية وجسور رائعة.\nالجولة الكبرى: عنابة (سانت أوغسطين)، قسنطينة، تيمقاد، جميلة.'},
          {t:'🤝', h:'مصمم للزوار الأجانب', d:'مرشدون ناطقون بالفرنسية والإنجليزية.\nاستقبال في المطار (الوصول إلى الجزائر العاصمة).\nتنظيم الإقامة والنقل واللوجستيك.\nمعلومات التأشيرة والإجراءات عند الطلب.'},
          {t:'📞', h:'الحجز والاستفسار', d:'Saint Augustin Travel\n☎️ 0554 67 89 21\n☎️ 0669 00 21 18\n✉️ comercial.staugustin@gmail.com'}
        ] }
    },
    'sur-les-traces-des-saints': {
      img:'promo/circuit-saints-traces.jpg',
      fr:{ title:'Sur les Traces des Saints', sub:'Circuit · 5 jours / 4 nuits · Pension complète', book:'Sur les Traces des Saints',
        text:"Saint Augustin est né en 354 à Thagaste (l'actuelle Souk Ahras) et fut évêque d'Hippone, l'antique cité romaine devenue Annaba. Ce circuit spirituel relie Alger à Oran en passant par Mostaganem et Tlemcen, sur les pas des Pères de l'Église : Basilique Saint-Augustin, ruines d'Hippone Regius et patrimoine bâti par les civilisations romaine, zianide et ottomane. Cinq jours de foi, d'histoire et de paysages." },
      en:{ title:'In the Footsteps of the Saints', sub:'Circuit · 5 days / 4 nights · Full board', book:'In the Footsteps of the Saints',
        text:"Saint Augustine was born in 354 in Thagaste (today's Souk Ahras) and became bishop of Hippo, the ancient Roman city now called Annaba. This spiritual circuit links Algiers to Oran via Mostaganem and Tlemcen, in the footsteps of the Church Fathers: the Saint Augustine Basilica, the ruins of Hippo Regius and heritage built by the Roman, Zayyanid and Ottoman civilizations. Five days of faith, history and landscapes." },
      ar:{ title:'على خطى الأولياء', sub:'جولة · 5 أيام / 4 ليالٍ · إقامة كاملة', book:'على خطى الأولياء',
        text:"وُلد القديس أوغسطينوس سنة 354 في تاغاست (سوق أهراس الحالية) وكان أسقفاً على هيبون، المدينة الرومانية القديمة التي أصبحت عنابة. تربط هذه الجولة الروحية الجزائر العاصمة بوهران مروراً بمستغانم وتلمسان، على خطى آباء الكنيسة: بازيليك القديس أوغسطين، أطلال هيبون ريجيوس وتراث بنته الحضارات الرومانية والزيانية والعثمانية. خمسة أيام من الإيمان والتاريخ والمناظر." }
    },
    'constantine-carthage': {
      img:{fr:'promo/pic-constantine-carthage-fr.jpg', en:'promo/pic-constantine-carthage-en.jpg', ar:'promo/pic-constantine-carthage-ar.jpg'},
      fr:{ title:'Du ciel de Constantine à la ville éternelle de Carthage', sub:'Circuit · 5 jours / 4 nuits · Départ & retour Constantine', book:'Du ciel de Constantine aux villes de Carthage',
        text:"De la ville des ponts suspendus au-dessus du Rhummel, envol vers la Tunisie pour suivre les traces de l'histoire et de la foi : Sidi Bou Saïd aux portes bleues andalouses, Carthage et ses thermes d'Antonin, Kairouan la sainte, Sousse et Monastir, sans oublier la médina de Tunis. Un voyage de 5 jours / 4 nuits entre mer, patrimoine universel et spiritualité, avec départs et retours depuis Constantine.",
        info:["🛫 Départ & retour Constantine","🗓️ 5 jours / 4 nuits","🇹🇳 Hammamet · Sidi Bou Saïd · Carthage","🕌 Kairouan · Sousse · Monastir · Tunis","🏖️ Hôtel + pension"],
        program:[
          {t:'01', h:'JOUR 1 – Hammamet · Sidi Bou Saïd · Carthage', d:'· Accueil à l’aéroport international de Tunis-Carthage et transfert à Hammamet. Installation à l’hôtel.\n· Départ vers Sidi Bou Saïd : village célèbre pour son architecture andalouse aux portes et fenêtres bleues, avec vue panoramique sur la mer.\n· Déjeuner dans un restaurant local et temps libre.\n· Après-midi : visite de Carthage (thermes d’Antonin, quartier punique) et du Musée national de Carthage.\n· Retour à l’hôtel, dîner et nuitée.'},
          {t:'02', h:'JOUR 2 – Kairouan · Sousse', d:'· Petit-déjeuner, départ vers Kairouan, l’une des plus anciennes villes islamiques du Maghreb.\n· Visite de la Grande Mosquée Okba Ibn Nafi et des Bassins des Aghlabides (site UNESCO).\n· Visite du Mausolée de Sidi Sahbi et de la médina.\n· Déjeuner dans un restaurant local.\n· Après-midi : départ vers Sousse, installation à l’hôtel et temps libre. Dîner et nuitée.'},
          {t:'03', h:'JOUR 3 – Monastir · Médina de Sousse', d:'· Petit-déjeuner, départ vers Monastir.\n· Visite du Ribat de Monastir, l’une des plus anciennes forteresses islamiques d’Afrique du Nord.\n· Temps libre : Mausolée de Bourguiba et port de plaisance.\n· Déjeuner dans un restaurant local.\n· Après-midi : retour à Sousse et visite de sa médina (site UNESCO), temps libre pour le shopping. Dîner et nuitée.'},
          {t:'04', h:'JOUR 4 – Tunis · Carthage · Shopping', d:'· Petit-déjeuner, départ vers Tunis et entrée dans la médina par la porte de la mer.\n· Visite de Carthage : vestiges anciens, notamment les thermes d’Antonin.\n· Temps libre dans les souks : Souk El Berka, Souk Attarine, épices, tissus et artisanat.\n· Déjeuner dans un restaurant local au cœur de la médina.\n· Soirée libre, dîner à l’hôtel et nuitée.'},
          {t:'05', h:'JOUR 5 – Départ · Retour vers Constantine', d:'· Petit-déjeuner, check-out et formalités de départ.\n· Transfert à l’aéroport international de Tunis-Carthage et vol retour vers Constantine.\n· Retour au pays avec des souvenirs inoubliables.'},
          {t:'📞', h:'Réservation & information', d:'Saint Augustin Travel\n☎️ 0554 67 89 21\n☎️ 0669 00 21 18\n☎️ 0669 00 21 17\n✉️ comercial.staugustin@gmail.com'}
        ] },
      en:{ title:'From the sky of Constantine to the eternal city of Carthage, on the paths of history and faith', sub:'Algeria – Tunisia · Complete itinerary · 5 days / 4 nights · Dep. & return Constantine', book:'From the sky of Constantine to the eternal city of Carthage',
        text:"ALGERIA – TUNISIA: COMPLETE ITINERARY. From the city of bridges suspended above the Rhummel, fly to Tunisia to walk the paths of history and faith: Sidi Bou Saïd with its blue Andalusian doors, Carthage and its Antonine Baths, holy Kairouan, Sousse and Monastir, and the medina of Tunis. A 5-day / 4-night journey between sea, world heritage and spirituality, with departure and return from Constantine.",
        info:["🛫 Dep. & return Constantine","🗓️ 5 days / 4 nights","🇹🇳 Hammamet · Sidi Bou Saïd · Carthage","🕌 Kairouan · Sousse · Monastir · Tunis","🏖️ Hotel + board"],
        program:[
          {t:'01', h:'DAY 1 – Arrival · Hammamet · Sidi Bou Saïd / Carthage', d:'· Morning: arrival at Tunis-Carthage International Airport, welcome by our team and transfer to Hammamet. Check-in at your hotel and completion of check-in formalities.\n· Sidi Bou Saïd: departure to this charming village famous for its Andalusian architecture with blue doors and windows, and its panoramic sea view.\n· Lunch: in a local restaurant, then free time.\n· Afternoon: visit of Carthage, ancient Phoenician and Roman city: the Antonine Baths, the Punic ports, etc.\n· Visit of the National Museum of Carthage. Return to the hotel.\n· Evening: dinner at the hotel and overnight stay.'},
          {t:'02', h:'DAY 2 – Kairouan (spiritual capital of Islam in the Maghreb) · Sousse', d:'· Morning: after breakfast at the hotel, departure to Kairouan, one of the oldest Islamic cities in the Maghreb.\n· Visit of the Great Mosque of Okba Ibn Nafi and the Aghlabid Basins (UNESCO World Heritage site).\n· Visit of the Mausoleum of Sidi Sahbi and the Medina.\n· Lunch in a local restaurant.\n· Afternoon: departure to Sousse, check-in at the hotel and free time to relax.\n· Evening: dinner at the hotel and overnight stay.'},
          {t:'03', h:'DAY 3 – Monastir · The Ribat · Medina of Sousse (history and shopping)', d:'· Morning: after breakfast at the hotel, departure to Monastir.\n· Visit of the Ribat of Monastir (one of the oldest Islamic fortresses in North Africa).\n· Free time to discover the Bourguiba Mausoleum and the marina.\n· Lunch in a local restaurant.\n· Afternoon: return to Sousse and visit its Medina (UNESCO World Heritage site), free time for shopping and strolling.\n· Evening: return to the hotel, dinner and overnight stay.'},
          {t:'04', h:'DAY 4 – Tunis · Carthage · Medina of Tunis and shopping', d:'· Morning: after breakfast at the hotel, departure to Tunis.\n· Entry to the Medina of Tunis through the sea gate.\n· Visit of Carthage: discovery of its ancient ruins, the Antonine Baths, the Punic ports, etc.\n· Free time for shopping in the souks: Souk El Berka and Souk Attarine, spice souk, fabric souk, and handicrafts souk.\n· Lunch in a local restaurant in the heart of the Medina.\n· Evening: free time to relax at the hotel or take a walk in Tunis.\n· Dinner at the hotel and overnight stay.'},
          {t:'05', h:'DAY 5 – Departure · Return to Constantine', d:'· Morning: after breakfast at the hotel, check-out and departure formalities.\n· Transfer to Tunis-Carthage International Airport for your return flight to Constantine.\n· Return home with unforgettable memories.'},
          {t:'📞', h:'Reservation & information', d:'Saint Augustin Travel\n☎️ 0554 67 89 21\n☎️ 0669 00 21 18\n☎️ 0669 00 21 17\n✉️ comercial.staugustin@gmail.com'}
        ] },
      ar:{ title:'من سماء قسنطينة إلى المدينة الخالدة قرطاج', sub:'جولة · 5 أيام / 4 ليالٍ · انطلاق وعودة قسنطينة', book:'من سماء قسنطينة إلى مدن قرطاج',
        text:"من مدينة الجسور المعلقة فوق وادي الرمال، سافروا إلى تونس على خطى التاريخ والإيمان: سيدي بوسعيد بأبوابه الزرقاء الأندلسية، قرطاج وحمامات أنطونان، القيروان المقدسة، سوسة والمنستير، فضلاً عن مدينة تونس العتيقة. رحلة 5 أيام / 4 ليالٍ بين البحر والتراث العالمي والروحانية، بانطلاق وعودة من قسنطينة.",
        info:["🛫 انطلاق وعودة قسنطينة","🗓️ 5 أيام / 4 ليالٍ","🇹🇳 الحمامات · سيدي بوسعيد · قرطاج","🕌 القيروان · سوسة · المنستير · تونس","🏖️ فندق + إقامة"],
        program:[
          {t:'01', h:'اليوم 1 – الحمامات · سيدي بوسعيد · قرطاج', d:'· استقبال في مطار تونس-قرطاج الدولي والتحويل إلى الحمامات، ثم الإقامة في الفندق.\n· الانطلاق نحو سيدي بوسعيد: قرية تشتهر بهندستها الأندلسية بأبوابها ونوافذها الزرقاء، مع إطلالة بانورامية على البحر.\n· غداء في مطعم محلي مع وقت حر.\n· بعد الظهر: زيارة قرطاج (حمامات أنطونان، الحي البوني) والمتحف الوطني لقرطاج.\n· العودة إلى الفندق، عشاء وليلة.'},
          {t:'02', h:'اليوم 2 – القيروان · سوسة', d:'· فطور الصباح، ثم الانطلاق نحو القيروان، إحدى أقدم المدن الإسلامية في المغرب العربي.\n· زيارة الجامع الكبير عقبة بن نافع وأحواض الأغالبة (موقع يونسكو).\n· زيارة ضريح سيدي صحبي والمدينة العتيقة.\n· غداء في مطعم محلي.\n· بعد الظهر: الانطلاق نحو سوسة والإقامة في الفندق مع وقت حر. عشاء وليلة.'},
          {t:'03', h:'اليوم 3 – المنستير · مدينة سوسة العتيقة', d:'· فطور الصباح، ثم الانطلاق نحو المنستير.\n· زيارة الرباط بالمنستير، من أقدم الحصون الإسلامية في شمال أفريقيا.\n· وقت حر: ضريح بورقيبة والميناء السياحي.\n· غداء في مطعم محلي.\n· بعد الظهر: العودة إلى سوسة وزيارة مدينتها العتيقة (موقع يونسكو) مع وقت للتسوق. عشاء وليلة.'},
          {t:'04', h:'اليوم 4 – تونس · قرطاج · تسوق', d:'· فطور الصباح، ثم الانطلاق نحو تونس والدخول إلى المدينة العتيقة من باب البحر.\n· زيارة قرطاج: الآثار القديمة خاصة حمامات أنطونان.\n· وقت حر في الأسواق: سوق البركة، سوق العطارين، أسواق التوابل والأقمشة والحرف.\n· غداء في مطعم محلي في قلب المدينة العتيقة.\n· مساء حر، عشاء بالفندق وليلة.'},
          {t:'05', h:'اليوم 5 – الانطلاق · العودة إلى قسنطينة', d:'· فطور الصباح، إنهاء إجراءات المغادرة.\n· التحويل إلى مطار تونس-قرطاج الدولي ورحلة العودة إلى قسنطينة.\n· العودة إلى الوطن بذكريات لا تُنسى.'},
          {t:'📞', h:'الحجز والاستفسار', d:'Saint Augustin Travel\n☎️ 0554 67 89 21\n☎️ 0669 00 21 18\n☎️ 0669 00 21 17\n✉️ comercial.staugustin@gmail.com'}
        ] }
    },
    'constantine-tunisia': {
      img:{fr:'promo/pic-constantine-tunisia-fr.jpg', en:'promo/pic-constantine-tunisia-en.jpg', ar:'promo/pic-constantine-tunisia-ar.jpg'},
      fr:{ title:'From Constantine to magnificent Tunisia — A land and sea tour across cities, deserts and the eternal Carthage', sub:'Algérie – Tunisie · Itinéraire complet · 5 jours / 4 nuits · Départ & retour Constantine', book:'From Constantine to magnificent Tunisia',
        text:"Algérie – Tunisie : itinéraire complet, publié sur la page Facebook. Un tour terrestre et maritime à travers Tunis, Hammamet, Kairouan, Sousse et Monastir, jusqu'à l'éternelle Carthage. 5 jours / 4 nuits entre villes, déserts et patrimoine universel, avec départs et retours depuis Constantine.",
        info:["🛫 Départ & retour Constantine","🗓️ 5 jours / 4 nuits","🇹🇳 Tunis · Hammamet · Kairouan","🕌 Sousse · Monastir · Carthage","🏖️ Hôtel + pension"],
        program:[
          {t:'01', h:'JOUR 1 – Arrivée · Hammamet · Sidi Bou Saïd / Carthage', d:'· Matin : accueil à l’aéroport international de Tunis-Carthage par notre équipe et transfert à Hammamet. Enregistrement à l’hôtel et formalités d’accueil.\n· Départ vers le village de Sidi Bou Saïd, célèbre pour son architecture andalouse aux portes et fenêtres bleues, avec vue panoramique sur la mer.\n· Déjeuner dans un restaurant local, puis temps libre.\n· Après-midi : visite du site historique de Carthage, ses ruines anciennes, en particulier les Thermes d’Antonin.\n· Visite du Musée national de Carthage. Retour à l’hôtel.\n· Soirée : dîner à l’hôtel et nuitée.'},
          {t:'02', h:'JOUR 2 – Kairouan (capitale spirituelle de l’Islam au Maghreb) · Sousse', d:'· 08:00 : après le petit-déjeuner à l’hôtel, départ vers la ville sainte de Kairouan, l’une des plus anciennes villes islamiques du Maghreb.\n· Visite de la Grande Mosquée d’Uqba Ibn Nafi et des Bassins des Aghlabides (site classé UNESCO).\n· Visite du Mausolée de Sidi Sahbi et de la Médina.\n· Déjeuner dans un restaurant local.\n· Après-midi : départ vers Sousse, enregistrement à l’hôtel et temps libre pour se détendre.\n· Soirée : dîner à l’hôtel et nuitée.'},
          {t:'03', h:'JOUR 3 – Monastir · Ribat · Médina de Sousse (histoire et shopping)', d:'· 08:30 : après le petit-déjeuner à l’hôtel, départ vers Monastir.\n· Visite du Ribat de Monastir (l’une des plus anciennes forteresses islamiques d’Afrique du Nord).\n· Temps libre pour découvrir le Mausolée de Bourguiba et le port.\n· Déjeuner dans un restaurant local.\n· Après-midi : retour à Sousse et visite de sa Médina (site UNESCO), temps libre pour le shopping et la flânerie.\n· Soirée : retour à l’hôtel, dîner et nuitée.'},
          {t:'04', h:'JOUR 4 – Tunis · Carthage · Médina de Tunis et shopping', d:'· 08:30 : après le petit-déjeuner à l’hôtel, départ vers Tunis.\n· Entrée dans la Médina de Tunis par la porte de la mer.\n· Visite du site historique de Carthage, ses ruines et les Thermes d’Antonin.\n· Temps libre pour le shopping dans les souks : Souk El Berka et Souk Attarine, souk des épices, des tissus et de l’artisanat.\n· Déjeuner dans un restaurant local au cœur de la Médina.\n· Soirée : temps libre pour se détendre à l’hôtel ou se promener à Tunis.\n· Dîner à l’hôtel et nuitée.'},
          {t:'05', h:'JOUR 5 – Départ · Retour vers Constantine', d:'· Matin : après le petit-déjeuner à l’hôtel, check-out et formalités de départ.\n· Transfert à l’aéroport international de Tunis-Carthage pour votre vol retour vers Constantine.\n· Retour au pays avec de merveilleux souvenirs.'},
          {t:'📞', h:'Réservation & information', d:'Saint Augustin Travel\n☎️ 0554 67 89 21\n☎️ 0669 00 21 18\n☎️ 0669 00 21 17\n✉️ comercial.staugustin@gmail.com'}
        ] },
      en:{ title:'From Constantine to magnificent Tunisia — A land and sea tour across cities, deserts and the eternal Carthage', sub:'Algeria – Tunisia · Complete itinerary · 5 days / 4 nights · Dep. & return Constantine', book:'From Constantine to magnificent Tunisia',
        text:"ALGERIA – TUNISIA: COMPLETE ITINERARY, published on the Facebook page. A land and sea tour across Tunis, Hammamet, Kairouan, Sousse and Monastir, and the eternal Carthage. 5 days / 4 nights between cities, deserts and world heritage, with departure and return from Constantine.",
        info:["🛫 Dep. & return Constantine","🗓️ 5 days / 4 nights","🇹🇳 Tunis · Hammamet · Kairouan","🕌 Sousse · Monastir · Carthage","🏖️ Hotel + board"],
        program:[
          {t:'01', h:'DAY 1 – Arrival · Hammamet · Sidi Bou Saïd / Carthage', d:'· Morning: meet at Tunis-Carthage International Airport by our team and transfer to Hammamet. Check-in at your hotel and complete check-in formalities.\n· Departure to the village of Sidi Bou Saïd, famous for its Andalusian architecture with blue doors and windows, and its panoramic view of the sea.\n· Lunch in a local restaurant, then free time.\n· Afternoon: visit the historic site of Carthage, explore its ancient ruins, especially the Antonine Baths.\n· Visit the National Museum of Carthage. Return to the hotel.\n· Evening: dinner at the hotel, overnight stay.'},
          {t:'02', h:'DAY 2 – Kairouan (spiritual capital of Islam in the Maghreb) · Sousse', d:'· 08:00: after breakfast at the hotel, departure towards the holy city of Kairouan, one of the oldest Islamic cities in the Maghreb.\n· Visit the Great Mosque of Uqba Ibn Nafi and the Aghlabid Basins (a UNESCO World Heritage site).\n· Visit the Mausoleum of Sidi Sahbi and the Medina.\n· Lunch in a local restaurant.\n· Afternoon: departure to Sousse, check-in at the hotel, free time to relax.\n· Evening: dinner at the hotel, overnight stay.'},
          {t:'03', h:'DAY 3 – Monastir · Ribat · Medina of Sousse (history and shopping)', d:'· 08:30: after breakfast at the hotel, departure to Monastir.\n· Visit the Ribat of Monastir (one of the oldest Islamic fortresses in North Africa).\n· Free time to discover the Mausoleum of Bourguiba and the port.\n· Lunch in a local restaurant.\n· Afternoon: return to Sousse and visit its Medina (UNESCO World Heritage site), free time for shopping and strolling.\n· Evening: return to the hotel, dinner and overnight stay.'},
          {t:'04', h:'DAY 4 – Tunis · Carthage · Medina of Tunis and Shopping', d:'· 08:30: after breakfast at the hotel, departure to Tunis.\n· Enter the Medina of Tunis through the sea gate.\n· Visit the historic site of Carthage, explore its ruins and the Antonine Baths.\n· Free time for shopping in the souks: Souk El Berka and Souk Attarine, spice souk, fabric souk, and handicrafts souk.\n· Lunch in a local restaurant in the heart of the Medina.\n· Evening: free time to relax at the hotel or take a walk in Tunis.\n· Dinner at the hotel, overnight stay.'},
          {t:'05', h:'DAY 5 – Departure · Return to Constantine', d:'· Morning: after breakfast at the hotel, check-out and departure formalities.\n· Transfer to Tunis-Carthage International Airport for your return flight to Constantine.\n· Return home with wonderful memories.'},
          {t:'📞', h:'Reservation & information', d:'Saint Augustin Travel\n☎️ 0554 67 89 21\n☎️ 0669 00 21 18\n☎️ 0669 00 21 17\n✉️ comercial.staugustin@gmail.com'}
        ] },
      ar:{ title:'From Constantine to magnificent Tunisia — A land and sea tour across cities, deserts and the eternal Carthage', sub:'الجزائر – تونس · مسار كامل · 5 أيام / 4 ليالٍ · انطلاق وعودة قسنطينة', book:'From Constantine to magnificent Tunisia',
        text:"الجزائر – تونس: مسار كامل، منشور على صفحة الفيسبوك. جولة برية وبحرية عبر تونس، الحمامات، القيروان، سوسة والمنستير، حتى قرطاج الخالدة. 5 أيام / 4 ليالٍ بين المدن والصحراء والتراث العالمي، بانطلاق وعودة من قسنطينة.",
        info:["🛫 انطلاق وعودة قسنطينة","🗓️ 5 أيام / 4 ليالٍ","🇹🇳 تونس · الحمامات · القيروان","🕌 سوسة · المنستير · قرطاج","🏖️ فندق + إقامة"],
        program:[
          {t:'01', h:'اليوم 1 – الوصول · الحمامات · سيدي بوسعيد / قرطاج', d:'· صباحاً: استقبال في مطار تونس-قرطاج الدولي من طرف فريقنا والتحويل إلى الحمامات، ثم إتمام إجراءات التسجيل في الفندق.\n· الانطلاق نحو قرية سيدي بوسعيد، المشهورة بهندستها الأندلسية بأبوابها ونوافذها الزرقاء وإطلالتها البانورامية على البحر.\n· غداء في مطعم محلي ثم وقت حر.\n· بعد الظهر: زيارة الموقع التاريخي لقرطاج واستكشاف آثاره القديمة، خاصة حمامات أنطونان.\n· زيارة المتحف الوطني لقرطاج. العودة إلى الفندق.\n· مساءً: عشاء في الفندق وليلة.'},
          {t:'02', h:'اليوم 2 – القيروان (العاصمة الروحية للإسلام في المغرب العربي) · سوسة', d:'· 08:00: بعد فطور الصباح في الفندق، الانطلاق نحو المدينة المقدسة القيروان، إحدى أقدم المدن الإسلامية في المغرب العربي.\n· زيارة الجامع الكبير عقبة بن نافع وأحواض الأغالبة (موقع مصنف ضمن اليونسكو).\n· زيارة ضريح سيدي صحبي والمدينة العتيقة.\n· غداء في مطعم محلي.\n· بعد الظهر: الانطلاق نحو سوسة، التسجيل في الفندق ووقت حر للاسترخاء.\n· مساءً: عشاء في الفندق وليلة.'},
          {t:'03', h:'اليوم 3 – المنستير · الرباط · مدينة سوسة العتيقة (تاريخ وتسوق)', d:'· 08:30: بعد فطور الصباح في الفندق، الانطلاق نحو المنستير.\n· زيارة الرباط بالمنستير (من أقدم الحصون الإسلامية في شمال أفريقيا).\n· وقت حر لاكتشاف ضريح بورقيبة والميناء.\n· غداء في مطعم محلي.\n· بعد الظهر: العودة إلى سوسة وزيارة مدينتها العتيقة (موقع يونسكو)، ووقت حر للتسوق والتنزه.\n· مساءً: العودة إلى الفندق، عشاء وليلة.'},
          {t:'04', h:'اليوم 4 – تونس · قرطاج · مدينة تونس العتيقة والتسوق', d:'· 08:30: بعد فطور الصباح في الفندق، الانطلاق نحو تونس.\n· الدخول إلى مدينة تونس العتيقة من باب البحر.\n· زيارة الموقع التاريخي لقرطاج واستكشاف آثاره وحمامات أنطونان.\n· وقت حر للتسوق في الأسواق: سوق البركة وسوق العطارين، سوق التوابل والأقمشة والحرف.\n· غداء في مطعم محلي في قلب المدينة العتيقة.\n· مساءً: وقت حر للاسترخاء في الفندق أو التنزه في تونس.\n· عشاء في الفندق وليلة.'},
          {t:'05', h:'اليوم 5 – الانطلاق · العودة إلى قسنطينة', d:'· صباحاً: بعد فطور الصباح في الفندق، إنهاء إجراءات المغادرة.\n· التحويل إلى مطار تونس-قرطاج الدولي لرحلة العودة إلى قسنطينة.\n· العودة إلى الوطن بذكريات رائعة.'},
          {t:'📞', h:'الحجز والاستفسار', d:'Saint Augustin Travel\n☎️ 0554 67 89 21\n☎️ 0669 00 21 18\n☎️ 0669 00 21 17\n✉️ comercial.staugustin@gmail.com'}
        ] }
    },
    'algeria-escapes': {
      img:{fr:'promo/pic-algeria-escapes-fr.jpg', en:'promo/pic-algeria-escapes-en.jpg', ar:'promo/pic-algeria-escapes-ar.jpg'},
      fr:{ title:'Mémorables escapades et voyages à travers l’histoire de l’Algérie', sub:'Algérie · Algiers – Blida – Chrêa – Tipaza · 5 jours / 4 nuits · Départ & retour Alger', book:'Mémorables escapades à travers l’histoire de l’Algérie',
        text:"Algérie : escapades mémorables à travers l'histoire — Alger, Blida, Chrêa et Tipaza. Un circuit de 5 jours / 4 nuits entre la capitale, les jardins de la vallée de la Chiffa, les forêts de cèdres de Chrêa et les ruines romaines de Tipaza devant la Méditerranée. Publié sur la page Facebook.",
        info:["🛫 Départ & retour Alger","🗓️ 5 jours / 4 nuits","🇩🇿 Alger · Blida · Chrêa · Tipaza","🌲 Chréa & parc de Gouraya","🏛️ Ruines romaines de Tipaza"],
        program:[
          {t:'01', h:'JOUR 1 – Arrivée, transfert et premières découvertes', d:'· Arrivée : arrivée à l’aéroport international Houari Boumediene d’Alger et transfert à l’hôtel.\n· Transfert : transfert à l’hôtel et enregistrement.\n· Temps libre : temps de repos après le voyage.\n· Visite : tour panoramique d’Alger pour découvrir les principaux sites de la capitale.\n· Dîner : dîner à l’hôtel.\n· Nuit : nuitée à l’hôtel.'},
          {t:'02', h:'JOUR 2 – Blida · Chrêa · Traditions et paysages historiques', d:'· Matin : visite de la ville de Blida, célèbre pour ses jardins fortifiés (El Kouds).\n· Découverte : découverte des jardins islamiques de la vallée de la Chiffa, du Marabout et de l’Université de Bouzaréah.\n· Déjeuner : déjeuner dans un restaurant local.\n· Après-midi : visite de Chrêa : téléphérique, vue panoramique et photos.\n· Soirée : retour à l’hôtel, dîner et nuitée.'},
          {t:'03', h:'JOUR 3 – Chrêa · Blida · Forêts et sanctuaires naturels', d:'· Matin : départ vers Blida et visite du Parc national de Gouraya (forêt de cèdres).\n· Activités : découverte de la nature, randonnées et balades en forêt.\n· Déjeuner : déjeuner dans un restaurant en pleine nature.\n· Après-midi : retour en téléphérique ou à pied vers la zone de loisirs.\n· Soirée : temps libre pour le shopping et la découverte du marché local.\n· Nuit : retour à l’hôtel, dîner et nuitée.'},
          {t:'04', h:'JOUR 4 – Chrêa · Tipaza · Histoire et plage', d:'· Matin : route vers Chrêa puis Tipaza.\n· Visite : visite du site archéologique de Tipaza (ruines romaines).\n· Découverte : découverte de la côte méditerranéenne et de la plage.\n· Déjeuner : déjeuner au bord de la mer.\n· Après-midi : visite des ruines et temps libre à la plage.\n· Soirée : retour à l’hôtel, dîner et nuitée.'},
          {t:'05', h:'JOUR 5 – Shopping et retour', d:'· Matin : temps libre à l’hôtel, shopping souvenirs (dattes, miel, artisanat algérien, etc.).\n· Préparation : préparation des bagages.\n· Transfert : transfert à l’aéroport international Houari Boumediene d’Alger.\n· Fin : fin de nos services et bon retour chez vous.'},
          {t:'📞', h:'Réservation & information', d:'Saint Augustin Travel\n☎️ 0554 67 89 21\n☎️ 0669 00 21 18\n☎️ 0669 00 21 17\n✉️ comercial.staugustin@gmail.com'}
        ] },
      en:{ title:'Memorable escapes and journeys through the history of Algeria', sub:'Algeria · Algiers – Blida – Chrêa – Tipaza · 5 days / 4 nights · Dep. & return Algiers', book:'Memorable escapes through the history of Algeria',
        text:"ALGERIA: memorable escapes and journeys through history — Algiers, Blida, Chrêa and Tipaza. A 5-day / 4-night circuit between the capital, the gardens of the Chiffa Valley, Chrêa's cedar forests and the Roman ruins of Tipaza facing the Mediterranean. Published on the Facebook page.",
        info:["🛫 Dep. & return Algiers","🗓️ 5 days / 4 nights","🇩🇿 Algiers · Blida · Chrêa · Tipaza","🌲 Chrêa & Gouraya park","🏛️ Roman ruins of Tipaza"],
        program:[
          {t:'01', h:'DAY 1 – Arrival, transfer and first discoveries', d:'· Arrival: arrival at Houari Boumediene International Airport in Algiers and transfer to the hotel.\n· Transfer: transfer to the hotel and check-in.\n· Free time: time to relax after the trip.\n· Visit: panoramic tour of Algiers to discover the main sites and the capital.\n· Dinner: dinner at the hotel.\n· Night: overnight stay at the hotel.'},
          {t:'02', h:'DAY 2 – Blida · Chrêa · Exploring traditions and historical landscapes', d:'· Morning: visit the city of Blida, famous for its walled gardens (El Kouds).\n· Discovery: discover the Islamic gardens of the Chiffa Valley and of the Marabout and the University of Bouzareah.\n· Lunch: lunch in a local restaurant.\n· Afternoon: visit Chrêa: cable car ride, panoramic view and photos.\n· Evening: return to the hotel, dinner and overnight stay.'},
          {t:'03', h:'DAY 3 – Chrêa · Blida · Forests and natural sanctuaries', d:'· Morning: departure to Blida and visit of the Gouraya National Park (cedar forest).\n· Activities: nature discovery, walks and visits in the forest.\n· Lunch: lunch in a restaurant in the heart of nature.\n· Afternoon: return by cable car or on foot to the leisure area.\n· Evening: free time for shopping and discovering the local market.\n· Night: return to the hotel, dinner and overnight stay.'},
          {t:'04', h:'DAY 4 – Chrêa · Tipaza · History and beach', d:'· Morning: drive to Chrêa and then to Tipaza.\n· Visit: visit of the archaeological site of Tipaza (Roman ruins).\n· Discovery: discover the Mediterranean coast and the beach.\n· Lunch: lunch by the sea.\n· Afternoon: visit the ruins and free time at the beach.\n· Evening: return to the hotel, dinner and overnight stay.'},
          {t:'05', h:'DAY 5 – Shopping and return', d:'· Morning: free time at the hotel, shopping for souvenirs (dates, honey, Algerian crafts, etc.).\n· Preparation: luggage preparation.\n· Transfer: transfer to Houari Boumediene International Airport in Algiers.\n· End: end of our services and a safe journey home.'},
          {t:'📞', h:'Reservation & information', d:'Saint Augustin Travel\n☎️ 0554 67 89 21\n☎️ 0669 00 21 18\n☎️ 0669 00 21 17\n✉️ comercial.staugustin@gmail.com'}
        ] },
      ar:{ title:'Memorable escapes and journeys through the history of Algeria', sub:'الجزائر · الجزائر العاصمة – البليدة – الشريعة – تيبازة · 5 أيام / 4 ليالٍ · انطلاق وعودة الجزائر', book:'Memorable escapes through the history of Algeria',
        text:"الجزائر: هروب لا يُنسى ورحلات عبر التاريخ — الجزائر العاصمة، البليدة، الشريعة وتيبازة. مسار 5 أيام / 4 ليالٍ بين العاصمة، حدائق وادي الشفة، غابات أرز الشريعة والآثار الرومانية لتيبازة المطلة على المتوسط. منشور على صفحة الفيسبوك.",
        info:["🛫 انطلاق وعودة الجزائر","🗓️ 5 أيام / 4 ليالٍ","🇩🇿 الجزائر · البليدة · الشريعة · تيبازة","🌲 الشريعة ومتنزه قورايا","🏛️ الآثار الرومانية لتيبازة"],
        program:[
          {t:'01', h:'اليوم 1 – الوصول والتحويل واكتشافات أولى', d:'· الوصول: الوصول إلى مطار هواري بومدين الدولي بالجزائر العاصمة والتحويل إلى الفندق.\n· التحويل: التحويل إلى الفندق وإتمام التسجيل.\n· وقت حر: وقت للاسترخاء بعد السفر.\n· زيارة: جولة بانورامية في الجزائر العاصمة لاكتشاف أهم معالم العاصمة.\n· عشاء: عشاء في الفندق.\n· ليلة: مبيت في الفندق.'},
          {t:'02', h:'اليوم 2 – البليدة · الشريعة · استكشاف التقاليد والمناظر التاريخية', d:'· صباحاً: زيارة مدينة البليدة، المشهورة بحدائقها المسوّرة (القدس).\n· اكتشاف: اكتشاف الحدائق الإسلامية لوادي الشفة والمرابط وجامعة بوزريعة.\n· غداء: غداء في مطعم محلي.\n· بعد الظهر: زيارة الشريعة: ركوب التلفريك، إطلالة بانورامية وصور.\n· مساءً: العودة إلى الفندق، عشاء وليلة.'},
          {t:'03', h:'اليوم 3 – الشريعة · البليدة · الغابات والمحميات الطبيعية', d:'· صباحاً: الانطلاق نحو البليدة وزيارة المتنزه الوطني لقورايا (غابة الأرز).\n· أنشطة: اكتشاف الطبيعة وتمشيات وزيارات في الغابة.\n· غداء: غداء في مطعم في قلب الطبيعة.\n· بعد الظهر: العودة بالتلفريك أو سيراً على الأقدام إلى منطقة الترفيه.\n· مساءً: وقت حر للتسوق واكتشاف السوق المحلي.\n· ليلة: العودة إلى الفندق، عشاء وليلة.'},
          {t:'04', h:'اليوم 4 – الشريعة · تيبازة · التاريخ والشاطئ', d:'· صباحاً: الطريق إلى الشريعة ثم تيبازة.\n· زيارة: زيارة الموقع الأثري لتيبازة (الآثار الرومانية).\n· اكتشاف: اكتشاف الساحل المتوسطي والشاطئ.\n· غداء: غداء على شاطئ البحر.\n· بعد الظهر: زيارة الآثار ووقت حر على الشاطئ.\n· مساءً: العودة إلى الفندق، عشاء وليلة.'},
          {t:'05', h:'اليوم 5 – التسوق والعودة', d:'· صباحاً: وقت حر في الفندق، تسوق للهدايا التذكارية (تمر، عسل، حرف جزائرية...).\n· تحضير: تحضير الحقائب.\n· تحويل: التحويل إلى مطار هواري بومدين الدولي بالجزائر العاصمة.\n· نهاية: نهاية خدماتنا وعودة موفقة إلى الديار.'},
          {t:'📞', h:'الحجز والاستفسار', d:'Saint Augustin Travel\n☎️ 0554 67 89 21\n☎️ 0669 00 21 18\n☎️ 0669 00 21 17\n✉️ comercial.staugustin@gmail.com'}
        ] }
    },
    'homes-of-the-righteous': {
      img:{fr:'promo/pic-homes-righteous-fr.jpg', en:'promo/pic-homes-righteous-en.jpg', ar:'promo/pic-homes-righteous-ar.jpg'},
      fr:{ title:'Dans les demeures des Justes', sub:'Un voyage culturel et spirituel sur les pas des quatre coins de l’Algérie · 5 jours / 4 nuits · Pension complète', book:'Dans les demeures des Justes',
        text:"Dans les demeures des Justes : un voyage culturel et spirituel sur les pas des quatre coins de l’Algérie — Alger, Mostaganem, Tlemcen et Oran. 5 jours / 4 nuits en pension complète, publié sur la page Facebook.",
        info:["🛫 Alger → Mostaganem → Tlemcen → Oran","🗓️ 5 jours / 4 nuits","🍽️ Pension complète","🗺️ Guide touristique","🚐 Transport"],
        program:[
          {t:'01', h:'JOUR 1 – Alger · Arrivée et premières découvertes', d:'· Accueil et prise en charge à l’aéroport d’Alger.\n· Tour panoramique de la capitale : le Monument des Martyrs, la Casbah et les sites emblématiques.\n· Installation à l’hôtel et dîner.\n· Nuitée à Alger.'},
          {t:'02', h:'JOUR 2 – Alger → Mostaganem', d:'· Petit-déjeuner puis route vers Mostaganem.\n· Visite de la corniche de Salamandre et des lieux de mémoire de la ville.\n· Déjeuner, installation à l’hôtel, temps libre et détente.\n· Dîner et nuitée à Mostaganem.'},
          {t:'03', h:'JOUR 3 – Mostaganem → Tlemcen', d:'· Petit-déjeuner puis route vers Tlemcen, la perle du Maghreb.\n· Visite de la Grande Mosquée, du minaret de Mansourah et des mausolées de Sidi Boumediene.\n· Déjeuner, installation à l’hôtel, promenade dans la médina.\n· Dîner et nuitée à Tlemcen.'},
          {t:'04', h:'JOUR 4 – Tlemcen → Oran', d:'· Petit-déjeuner puis route vers Oran.\n· Visite de la basilique Santa Cruz, du front de mer et de la vieille ville.\n· Déjeuner, installation à l’hôtel et temps libre.\n· Dîner et nuitée à Oran.'},
          {t:'05', h:'JOUR 5 – Oran · Retour', d:'· Petit-déjeuner, matinée libre et shopping souvenirs.\n· Transfert à l’aéroport d’Oran ou retour.\n· Fin de nos services et bon retour avec des souvenirs inoubliables.'},
          {t:'✅', h:'Le programme comprend', d:'Prise en charge et dépose à l’aéroport\nBillets d’avion et frais de service\nGuide touristique\nTransport\nPension complète avec hébergement'},
          {t:'📞', h:'Réservation & information', d:'Saint Augustin Travel\n☎️ 0554 67 89 21\n☎️ 0669 00 21 18\n☎️ 0669 00 21 17\n✉️ comercial.staugustin@gmail.com'}
        ] },
      en:{ title:'In the Homes of the Righteous', sub:'A cultural and spiritual journey in the footsteps of the four corners of Algeria · 5 days / 4 nights · Full board', book:'In the Homes of the Righteous',
        text:"In the Homes of the Righteous: a cultural and spiritual journey in the footsteps of the four corners of Algeria — Algiers, Mostaganem, Tlemcen and Oran. 5 days / 4 nights on a full-board basis, published on the Facebook page.",
        info:["🛫 Algiers → Mostaganem → Tlemcen → Oran","🗓️ 5 days / 4 nights","🍽️ Full board","🗺️ Tourist guide","🚐 Transport"],
        program:[
          {t:'01', h:'DAY 1 – Algiers · Arrival and first discoveries', d:'· Airport pickup and welcome in Algiers.\n· Panoramic tour of the capital: the Martyrs’ Memorial, the Casbah and iconic sites.\n· Hotel check-in and dinner.\n· Overnight in Algiers.'},
          {t:'02', h:'DAY 2 – Algiers → Mostaganem', d:'· Breakfast then road to Mostaganem.\n· Visit of the Salamandre corniche and the city’s places of memory.\n· Lunch, hotel check-in, free time and relaxation.\n· Dinner and overnight in Mostaganem.'},
          {t:'03', h:'DAY 3 – Mostaganem → Tlemcen', d:'· Breakfast then road to Tlemcen, the pearl of the Maghreb.\n· Visit of the Great Mosque, the Mansourah minaret and the mausoleums of Sidi Boumediene.\n· Lunch, hotel check-in, stroll through the medina.\n· Dinner and overnight in Tlemcen.'},
          {t:'04', h:'DAY 4 – Tlemcen → Oran', d:'· Breakfast then road to Oran.\n· Visit of the Santa Cruz Basilica, the seafront and the old town.\n· Lunch, hotel check-in and free time.\n· Dinner and overnight in Oran.'},
          {t:'05', h:'DAY 5 – Oran · Return', d:'· Breakfast, free morning and souvenir shopping.\n· Transfer to Oran airport or return.\n· End of our services and a safe journey back with unforgettable memories.'},
          {t:'✅', h:'The program includes', d:'Airport pickup and drop-off\nFlights and service fees\nTourist guide\nTransport\nFull board with accommodation'},
          {t:'📞', h:'Reservation & information', d:'Saint Augustin Travel\n☎️ 0554 67 89 21\n☎️ 0669 00 21 18\n☎️ 0669 00 21 17\n✉️ comercial.staugustin@gmail.com'}
        ] },
      ar:{ title:'في ديار الصالحين', sub:'رحلة ثقافية وروحية على خطى زوايا الجزائر الأربع · 5 أيام / 4 ليالٍ · إقامة كاملة', book:'في ديار الصالحين',
        text:"في ديار الصالحين: رحلة ثقافية وروحية على خطى زوايا الجزائر الأربع — الجزائر العاصمة، مستغانم، تلمسان ووهران. 5 أيام / 4 ليالٍ بإقامة كاملة، منشور على صفحة الفيسبوك.",
        info:["🛫 الجزائر → مستغانم → تلمسان → وهران","🗓️ 5 أيام / 4 ليالٍ","🍽️ إقامة كاملة","🗺️ مرشد سياحي","🚐 نقل"],
        program:[
          {t:'01', h:'اليوم 1 – الجزائر · الوصول وأولى الاكتشافات', d:'· استقبال ومرافقة في مطار الجزائر.\n· جولة بانورامية في العاصمة: مقام الشهداء، القصبة والمعالم البارزة.\n· الإقامة في الفندق وعشاء.\n· ليلة في الجزائر العاصمة.'},
          {t:'02', h:'اليوم 2 – الجزائر → مستغانم', d:'· فطور الصباح ثم الطريق نحو مستغانم.\n· زيارة كورنيش صلامندر وأماكن الذكرى بالمدينة.\n· غداء، إقامة في الفندق، وقت حر واسترخاء.\n· عشاء وليلة في مستغانم.'},
          {t:'03', h:'اليوم 3 – مستغانم → تلمسان', d:'· فطور الصباح ثم الطريق نحو تلمسان، لؤلؤة المغرب العربي.\n· زيارة الجامع الكبير، مئذنة المنصورة وأضرحة سيدي بومدين.\n· غداء، إقامة في الفندق، تنزه في المدينة العتيقة.\n· عشاء وليلة في تلمسان.'},
          {t:'04', h:'اليوم 4 – تلمسان → وهران', d:'· فطور الصباح ثم الطريق نحو وهران.\n· زيارة كنيسة سانتا كروز، الواجهة البحرية والمدينة القديمة.\n· غداء، إقامة في الفندق ووقت حر.\n· عشاء وليلة في وهران.'},
          {t:'05', h:'اليوم 5 – وهران · العودة', d:'· فطور الصباح، صباح حر وتسوق للهدايا التذكارية.\n· التحويل إلى مطار وهران أو العودة.\n· نهاية خدماتنا وعودة موفقة بذكريات لا تُنسى.'},
          {t:'✅', h:'البرنامج يشمل', d:'المطار والاستقبال والتوديع\nتذاكر الطيران ورسوم الخدمة\nمرشد سياحي\nنقل\nإقامة كاملة مع السكن'},
          {t:'📞', h:'الحجز والاستفسار', d:'Saint Augustin Travel\n☎️ 0554 67 89 21\n☎️ 0669 00 21 18\n☎️ 0669 00 21 17\n✉️ comercial.staugustin@gmail.com'}
        ] }
    },
    'cirta-constantine-2026': {
      img:{fr:'promo/pic-cirta-heritage-fr.jpg', en:'promo/pic-cirta-heritage-en.jpg', ar:'promo/pic-cirta.jpg'},
      fr:{ title:'Cirta – Constantine 🇩🇿', sub:'Circuit en Algérie · 3 jours / 2 nuits · Sur demande', book:'Cirta – Constantine',
        text:"Découvrez la gloire éternelle de la cité de Cirta (Constantine) : un programme touristique de 3 jours / 2 nuits à travers visites historiques, ponts spectaculaires et patrimoine vivant, avec Saint Augustin Travel.",
        info:["📍 Constantine","🗓️ 3 jours / 2 nuits","🏛️ Visites historiques","🌉 Ponts & gorges","🎶 Malouf & gastronomie"],
        program:[
          {t:'📅', h:'Programme', d:'Programme touristique à Constantine (Cirta) · 3 jours / 2 nuits'},
          {t:'🏛️', h:'Visites historiques', d:'Mausolée du roi Massinissa à El Khroub\nPalais d’Ahmed Bey\nMusée national de Cirta\nAvec des guides touristiques spécialisés'},
          {t:'🌉', h:'Ponts & aventure', d:'Balades féeriques au-dessus du grand ravin (la profonde vallée) pour les plus belles photos\nDécouverte des secrets de la « roche antique »'},
          {t:'🎶', h:'Héritage & gastronomie', d:'Dégustation de la gastronomie constantinoise authentique\nImmersion dans l’âge d’or de la musique traditionnelle « Malouf », dans une ambiance chaleureuse et accueillante'},
          {t:'📞', h:'Réservation & information', d:'Saint Augustin Travel\n📱 WhatsApp / Téléphone :\n0669 002 117\n0669 002 118\n✉️ Email : comercial.staugustin@gmail.com'}
        ] },
      en:{ title:'Cirta – Constantine 🇩🇿', sub:'Circuit in Algeria · 3 days / 2 nights · On request', book:'Cirta – Constantine',
        text:"Discover the eternal glory of the city of Cirta (Constantine): a tourist program of 3 days / 2 nights through historical visits, spectacular bridges and living heritage, with Saint Augustin Travel.",
        info:["📍 Constantine","🗓️ 3 days / 2 nights","🏛️ Historical visits","🌉 Bridges & gorges","🎶 Malouf & gastronomy"],
        program:[
          {t:'📅', h:'Program', d:'Tourist program in Constantine (Cirta) · 3 days / 2 nights'},
          {t:'🏛️', h:'Historical visits', d:'Mausoleum of King Massinissa at El Khroub\nAhmed Bey Palace\nNational Museum of Cirta\nWith specialized tourist guides'},
          {t:'🌉', h:'Bridges & adventure', d:'Magical walks above the great ravine (the deep valley) for the most beautiful photos\nDiscovering the secrets of the « ancient rock »'},
          {t:'🎶', h:'Heritage & gastronomy', d:'Tasting authentic Constantine cuisine\nImmersion in the golden age of the traditional « Malouf » music, in a warm and welcoming atmosphere'},
          {t:'📞', h:'Reservation & information', d:'Saint Augustin Travel\n📱 WhatsApp / Phone :\n0669 002 117\n0669 002 118\n✉️ Email : comercial.staugustin@gmail.com'}
        ] },
      ar:{ title:'سيرتا – قسنطينة 🇩🇿', sub:'جولة في الجزائر · 3 أيام / ليلتان · حسب الطلب', book:'سيرتا – قسنطينة',
        text:"اكتشفوا المجد الخالد لمدينة سيرتا (قسنطينة): برنامج سياحي 3 أيام / ليلتان من الجولات التاريخية والجسور الرائعة والتراث الحي، مع سانت أوغسطين ترافيل.",
        info:["📍 قسنطينة","🗓️ 3 أيام / ليلتان","🏛️ جولات تاريخية","🌉 الجسور والأخدود","🎶 المالوف والطهي"],
        program:[
          {t:'📅', h:'البرنامج', d:'برنامج سياحي في قسنطينة (سيرتا) · 3 أيام / ليلتان'},
          {t:'🏛️', h:'جولات تاريخية مخصصة', d:'زيارة ضريح الملك ماسينيسا في الخروب\nقصر أحمد باي\nالمتحف الوطني سيرتا\nبرفقة مرشدين سياحيين متخصصين'},
          {t:'🌉', h:'جولات الجسور والمغامرة', d:'جولات ساحرة فوق الأخدود العظيم (الوادي العميق) لالتقاط أجمل الصور\nاكتشاف أسرار « الصخرة العتيقة »'},
          {t:'🎶', h:'تجربة التراث وفن الطهي', d:'تذوق المأكولات القسنطينية الأصيلة\nالانغماس في أجواء العصر الذهبي لموسيقى « المالوف » التقليدية، وسط أجواء دافئة ومضيافة'},
          {t:'📞', h:'الحجز والاستفسار', d:'Saint Augustin Travel\n📱 واتساب / هاتف :\n0669002117\n0669002118\n✉️ البريد الإلكتروني : comercial.staugustin@gmail.com'}
        ] }
    },
    'circuit-ouest-2026': {
      img:{fr:'promo/pic-circuit-ouest-fr.jpg', en:'promo/pic-circuit-ouest-en.jpg', ar:'promo/pic-circuit-ouest.jpg'},
      fr:{ title:'Circuit Ouest – Oran / Tlemcen / Mostaganem 🚌🌴', sub:'Été 2026 · 3 étapes · Départ Annaba', book:'Circuit Ouest – Oran / Tlemcen / Mostaganem',
        text:"Prêt pour la plus belle randonnée de l’été 2026 ? Circuit Ouest : Oran, Tlemcen et Mostaganem, avec Saint Augustin Travel.",
        info:["📅 20–27 Août","🚌 Départ Annaba (Bouni) 20:00","🌊 Oran · ville et mer","🏔️ Tlemcen · nature","🎢 Mostaganem · Mostaland"],
        program:[
          {t:'📅', h:'Dates & départ', d:'Du 20 au 27 août 2026\nDépart d’Annaba (Bouni) à 20:00 le soir'},
          {t:'🌊', h:'Jour 1 – Oran : la ville et la mer', d:'Arrivée et installation à l’hôtel\nPetite visite :\n- La façade maritime\n- La place du 1er Novembre\n- Le centre-ville d’Oran'},
          {t:'🏔️', h:'Jour 2 – Tlemcen : beauté et nature', d:'Excursion d’une journée complète :\n- Grottes de Bani Ad\n- Lalla Setti\n- Le Mechouar royal\n- Mosquée Sidi Boumediene'},
          {t:'🎡', h:'Jour 3 – Mostaganem : une fin agréable', d:'Mostaland\nCorniche Salamandre\nDétente + photos\nRetour à Annaba'},
          {t:'💬', h:'Ce n’est pas qu’un voyage…', d:'C’est une expérience\nDes souvenirs\nEt de nouveaux amis'},
          {t:'📞', h:'Réservation & information', d:'📱 0669002117\n📱 0669002118\n📱 0554678921\n📍 Bouni – Annaba'}
        ] },
      en:{ title:'West Circuit – Oran / Tlemcen / Mostaganem 🚌🌴', sub:'Summer 2026 · 3 stages · Departure Annaba', book:'West Circuit – Oran / Tlemcen / Mostaganem',
        text:"Ready for the most beautiful trip of summer 2026? West Circuit: Oran, Tlemcen and Mostaganem, with Saint Augustin Travel.",
        info:["📅 20–27 Aug","🚌 Departure Annaba (Bouni) 20:00","🌊 Oran · city and sea","🏔️ Tlemcen · nature","🎢 Mostaganem · Mostaland"],
        program:[
          {t:'📅', h:'Dates & departure', d:'From 20 to 27 August 2026\nDeparture from Annaba (Bouni) at 20:00 in the evening'},
          {t:'🌊', h:'Day 1 – Oran: the city and the sea', d:'Arrival and hotel check-in\nShort visit:\n- The seafront\n- The 1st of November square\n- Oran city centre'},
          {t:'🏔️', h:'Day 2 – Tlemcen: beauty and nature', d:'Full-day excursion:\n- Bani Ad caves\n- Lalla Setti\n- The royal Mechouar\n- Sidi Boumediene Mosque'},
          {t:'🎡', h:'Day 3 – Mostaganem: a pleasant finish', d:'Mostaland\nSalamandre Corniche\nRelaxation + photos\nReturn to Annaba'},
          {t:'💬', h:'It’s not just a trip…', d:'It’s an experience\nMemories\nAnd new friends'},
          {t:'📞', h:'Reservation & information', d:'📱 0669002117\n📱 0669002118\n📱 0554678921\n📍 Bouni – Annaba'}
        ] },
      ar:{ title:'سيركت الغرب – وهران / تلمسان / مستغانم 🚌🌴', sub:'صيف 2026 · 3 محطات · انطلاق عنابة', book:'سيركت الغرب – وهران / تلمسان / مستغانم',
        text:"هل أنتم مستعدون لأجمل رحلة صيف 2026؟ سيركت الغرب: وهران وتلمسان ومستغانم، مع سانت أوغسطين ترافيل.",
        info:["📅 20–27 أوت","🚌 انطلاق عنابة (البوني) 20:00","🌊 وهران · المدينة والبحر","🏔️ تلمسان · الجمال والطبيعة","🎢 مستغانم · موستالاند"],
        program:[
          {t:'📅', h:'التواريخ والانطلاق', d:'من 20 إلى 27 أوت 2026\nالانطلاق من عنابة (البوني) على الساعة 20:00 ليلاً'},
          {t:'🌊', h:'اليوم 1 – وهران: المدينة والبحر', d:'الوصول والاستقرار في الفندق\nجولة خفيفة:\n- الواجهة البحرية\n- ساحة أول نوفمبر\n- وسط مدينة وهران'},
          {t:'🏔️', h:'اليوم 2 – تلمسان: الجمال والطبيعة', d:'رحلة يوم كامل:\n- مغارات بني عاد\n- لالة ستي\n- المشور الملكي\n- جامع سيدي بومدين'},
          {t:'🎡', h:'اليوم 3 – مستغانم: الختام الممتع', d:'Mostaland\nكورنيش صلامندر\nاستجمام + صور\nالعودة إلى عنابة'},
          {t:'💬', h:'ليست مجرد رحلة…', d:'إنها تجربة\nذكريات\nوأصدقاء جدد'},
          {t:'📞', h:'الحجز والاستفسار', d:'📱 0669002117\n📱 0669002118\n📱 0554678921\n📍 البوني – عنابة'}
        ] }
    },
    'annaba-summer-2026': {
      img:{fr:'promo/pic-annaba-summer-fr.jpg', en:'promo/pic-annaba-summer-en.jpg', ar:'promo/pic-annaba-summer.jpg'},
      fr:{ title:'Été à Annaba – Hôtel El Mountazah 🏖️', sub:'Groupes & Familles · 5 jours / 4 nuits', book:'Été à Annaba – Hôtel El Mountazah',
        text:"Pour échapper à la chaleur de l’été, Bouna vous ouvre les bras ! Offre spéciale groupes et familles à Annaba, avec Saint Augustin Tourisme & Voyages.",
        info:["🏨 Hôtel El Mountazah","🗓️ 5 jours / 4 nuits","💰 24 000 DA / pers.","🍳 Petit-déjeuner inclus","🏖️ Plage Djenane El Bey"],
        program:[
          {t:'🏨', h:'L’offre & l’hébergement', d:'Hôtel « El Mountazah » : confort et élégance dans la nature face à la mer\nDurée : 5 jours / 4 nuits\nPrix : 24 000 DA par personne (petit-déjeuner compris)\nDépart du 1er groupe : 25 au 29 août 2026 (d’autres groupes seront programmés)'},
          {t:'🎁', h:'Ce que l’offre comprend', d:'Petit-déjeuner inclus pendant tout le séjour\nAccès gratuit et agréable à la piscine de l’hôtel\nSortie programmée vers la plage de « Djenane El Bey » (sable doré, eaux cristallines)\nActivités et soirées familiales 100%'},
          {t:'⏳', h:'Places limitées', d:'Chers habitants du Sahara et des Hauts Plateaux, réservez vos places et changez de cadre à l’invitation de « Bouna la belle ». Nous prenons en charge la fatigue du voyage.'},
          {t:'📞', h:'Réservation & information', d:'📞 055467821 / 0669002117\n✉️ Email : comercial.staugustin@gmail.com'}
        ] },
      en:{ title:'Summer in Annaba – Hôtel El Mountazah 🏖️', sub:'Groups & Families · 5 days / 4 nights', book:'Summer in Annaba – Hôtel El Mountazah',
        text:"To escape the summer heat, Bouna opens its arms to you! Special offer for groups and families in Annaba, with Saint Augustin Tourisme & Voyages.",
        info:["🏨 Hôtel El Mountazah","🗓️ 5 days / 4 nights","💰 24,000 DZD / pers.","🍳 Breakfast included","🏖️ Djenane El Bey beach"],
        program:[
          {t:'🏨', h:'The offer & accommodation', d:'Hôtel « El Mountazah »: comfort and elegance in nature facing the sea\nDuration: 5 days / 4 nights\nPrice: 24,000 DZD per person (breakfast included)\nDeparture of the 1st group: 25 to 29 August 2026 (more groups to be scheduled)'},
          {t:'🎁', h:'What the offer includes', d:'Breakfast included for the whole stay\nFree and pleasant access to the hotel pool\nProgrammed trip to « Djenane El Bey » beach (golden sand, crystal waters)\n100% family activities and evenings'},
          {t:'⏳', h:'Limited places', d:'Dear inhabitants of the Sahara and the Highlands, book your seats and change the scenery at the invitation of « Bouna the beautiful ». We take care of the travel fatigue.'},
          {t:'📞', h:'Reservation & information', d:'📞 055467821 / 0669002117\n✉️ Email : comercial.staugustin@gmail.com'}
        ] },
      ar:{ title:'الصيف في عنابة – فندق المنتزه 🏖️', sub:'مجموعات وعائلات · 5 أيام / 4 ليالٍ', book:'الصيف في عنابة – فندق المنتزه',
        text:"هرباً من حر الصيف.. بونة تفتح لكم أحضانها! عرض خاص بالمجموعات والعائلات في عنابة، مع سانت أوغسطين ترافيل.",
        info:["🏨 فندق المنتزه","🗓️ 5 أيام / 4 ليالٍ","💰 24 000 دج للشخص","🍳 فطور مشمول","🏖️ شاطئ جنان الباي"],
        program:[
          {t:'🏨', h:'تفاصيل العرض والإقامة', d:'فندق « المنتزه »: راحة وأناقة وسط الطبيعة المطلة على البحر\nالمدة: 5 أيام / 4 ليالٍ\nالسعر: 24 000 دج للشخص الواحد (مع فطور الصباح)\nتاريخ انطلاق المجموعة الأولى: من 25 إلى 29 أوت 2026 (مع برمجة عدة مجموعات أخرى لاحقاً)'},
          {t:'🎁', h:'ماذا يشمل العرض؟', d:'فطور الصباح متضمن طيلة فترة الإقامة\nدخول مجاني وممتع إلى المسبح الخاص بالفندق\nخرجة مبرمجة إلى شاطئ « جنان الباي » الساحر\nنشاطات وسهرات ترفيهية عائلية 100%'},
          {t:'⏳', h:'الأماكن محدودة جداً', d:'يا سكان الصحراء الغالية والهضاب العليا الأبية، لا تترددوا في حجز مقاعدكم وتغيير الجو في ضيافة « بونة البهية ». دعوا عناء السفر علينا.'},
          {t:'📞', h:'الحجز والاستفسار', d:'📞 055467821 / 0669002117\n✉️ البريد الإلكتروني : comercial.staugustin@gmail.com'}
        ] }
    },
    'route-du-grand-sud': {
      img:'promo/pic-ghardaia.jpg',
      fr:{ title:'Route du Grand Sud', sub:'Circuit · 6 jours', book:'Route du Grand Sud',
        text:"Au-delà du Tell, le Sud algérien ouvre sur un monde de lumière. Ghardaïa et la vallée du M'Zab abritent cinq cités ksouriennes classées à l'UNESCO, fondées par les Ibadites au XIe siècle. Plus à l'ouest, Timimoun et sa palmeraie rouge bordent le Grand Erg Occidental. Dunes, oasis et ksour racontent dix siècles d'adaptation à l'une des plus rudes régions du Sahara." },
      en:{ title:'Route of the Deep South', sub:'Circuit · 6 days', book:'Route of the Deep South',
        text:"Beyond the Tell, the Algerian South opens onto a world of light. Ghardaïa and the M'Zab valley shelter five UNESCO-listed ksar towns, founded by the Ibadis in the 11th century. Further west, Timimoun and its red palm grove border the Great Western Erg. Dunes, oases and ksour tell ten centuries of adaptation to one of the harshest regions of the Sahara." },
      ar:{ title:'طريق الجنوب الكبير', sub:'جولة · 6 أيام', book:'طريق الجنوب الكبير',
        text:"وراء منطقة التل، ينفتح الجنوب الجزائري على عالم من النور. تضم غرداية ووادي مزاب خمس مدن قصورية مصنفة ضمن اليونسكو، أسستها الأباضية في القرن الحادي عشر. غرباً، تحد تيميمون ونخلتها الحمراء العرق الغربي الكبير. تحكي الكثبان والواحات والقصور عشرة قرون من التكيف مع واحدة من أقسى مناطق الصحراء." }
    },
    'casbah-medinas': {
      img:'hero-morning.png',
      fr:{ title:'La Casbah & ses Médinas', sub:'Circuit · 2 jours · Alger', book:'La Casbah et ses Médinas',
        text:"La Casbah d'Alger, cœur de la ville ottomane, domine la baie depuis le Xe siècle. Classée au patrimoine mondial, elle déroule au-dessus de la mer un dédale de ruelles pentues, de palais (Dar Hassan Pacha, palais du Dey), de mosquées et de maisons blanches surplombant la Méditerranée. C'est là que naquit l'Algérie moderne et que résonne encore l'histoire de la Régence d'Alger." },
      en:{ title:'The Casbah & its Medinas', sub:'Circuit · 2 days · Algiers', book:'The Casbah and its Medinas',
        text:"The Casbah of Algiers, heart of the Ottoman city, has dominated the bay since the 10th century. A UNESCO World Heritage site, it unfolds above the sea a maze of steep alleys, palaces (Dar Hassan Pacha, the Dey's palace), mosques and white houses overlooking the Mediterranean. This is where modern Algeria was born and where the history of the Regency of Algiers still resonates." },
      ar:{ title:'القصبة ومدنها العتيقة', sub:'جولة · يومان · الجزائر العاصمة', book:'القصبة ومدنها العتيقة',
        text:"القصبة في الجزائر العاصمة، قلب المدينة العثمانية، تهيمن على الخليج منذ القرن العاشر. مصنفة ضمن التراث العالمي، تعرض فوق البحر متاهة من الأزقة المنحدرة والقصور (دار حسين باشا، قصر الداي) والمساجد والبيوت البيضاء المطلة على المتوسط. هنا وُلدت الجزائر الحديثة وما زال صدى تاريخ إيالة الجزائر يتردد." }
    },
    'tassili-ajjer': {
      img:'promo/festival-sebiba.jpg',
      fr:{ title:'Route du Tassili n\'Ajjer', sub:'Circuit · 5 jours · Djanet', book:'Route du Tassili n\'Ajjer',
        text:"Le Tassili n'Ajjer, massif du Sud-Est algérien, est un musée à ciel ouvert. Des milliers de gravures et peintures rupestres, certaines vieilles de plus de 8 000 ans, y témoignent d'un Sahara autrefois verdoyant : faune de la savane, scènes de chasse et de danse. Djanet, sa palmeraie et la fête de la Sebiba prolongent cette rencontre avec les traditions touarègues." },
      en:{ title:'Route of the Tassili n\'Ajjer', sub:'Circuit · 5 days · Djanet', book:'Route of the Tassili n\'Ajjer',
        text:"The Tassili n'Ajjer, a massif in south-eastern Algeria, is an open-air museum. Thousands of rock engravings and paintings, some over 8,000 years old, bear witness to a once verdant Sahara: savannah fauna, hunting and dancing scenes. Djanet, its palm grove and the Sebiba festival extend this encounter with Tuareg traditions." },
      ar:{ title:'طريق طاسيلي ناجر', sub:'جولة · 5 أيام · جانت', book:'طريق طاسيلي ناجر',
        text:"طاسيلي ناجر، كتلة جبلية في جنوب شرق الجزائر، متحف في الهواء الطلق. تشهد آلاف النقوش والرسومات الصخرية، بعضها عمره أكثر من 8000 سنة، على صحراء كساها الخضار يوماً ما: حيوانات السافانا ومشاهد الصيد والرقص. تواصل جانت ونخلتها ومهرجان السبيبة هذا اللقاء مع التقاليد الطوارقية." }
    },
    'littoral-est': {
      img:'promo/pic-annaba.jpg',
      fr:{ title:'Route du Littoral Est', sub:'Circuit · 3 jours · Annaba / Jijel', book:'Route du Littoral Est',
        text:"De l'antique Hippone (Annaba) aux calanques de Jijel en passant par Skikda, la côte est algérienne porte l'empreinte des Phéniciens, des Romains, des Byzantins puis des Ottomans. Ruines romaines face à la mer, corniches sauvages, forêts et criques turquoise dessinent un littoral préservé, entre Annaba la savante et de petits ports chargés d'histoire." },
      en:{ title:'Route of the Eastern Coast', sub:'Circuit · 3 days · Annaba / Jijel', book:'Route of the Eastern Coast',
        text:"From ancient Hippo (Annaba) to the coves of Jijel via Skikda, the eastern Algerian coast bears the mark of the Phoenicians, Romans, Byzantines and then Ottomans. Roman ruins facing the sea, wild corniches, forests and turquoise creeks shape a preserved coastline, between learned Annaba and small ports steeped in history." },
      ar:{ title:'طريق الساحل الشرقي', sub:'جولة · 3 أيام · عنابة / جيجل', book:'طريق الساحل الشرقي',
        text:"من هيبون القديمة (عنابة) إلى خلجان جيجل مروراً بسكيكدة، تحمل السواحل الشرقية للجزائر بصمة الفينيقيين والرومان والبيزنطيين ثم العثمانيين. ترسم الآثار الرومانية المطلة على البحر والمنحدرات البرية والغابات والخلجان الفيروزية ساحلاً محفوظاً، بين عنابة العالمة والموانئ الصغيرة الحافلة بالتاريخ." }
    },

    /* ------- Circuits à l'International ------- */
    'omra-premium': {
      img:'promo/ext-saudi.jpg',
      fr:{ title:'Omra Premium', sub:'International · 10-15 jours', book:'Omra Premium',
        text:"La Maccah et Médine sont les villes saintes de l'islam. À La Maccah, la mosquée Al-Masjid al-Haram enserre la Kaaba, direction de prière des musulmans du monde entier. À Médine, la mosquée du Prophète (Masjid an-Nabawi) abrite notamment la tombe du Prophète. Ce circuit encadré réunit visas, vols et hébergement proche des Lieux Saints pour un pèlerinage en toute sérénité." },
      en:{ title:'Omra Premium', sub:'International · 10-15 days', book:'Omra Premium',
        text:"Makkah and Medina are the holy cities of Islam. In Makkah, the Al-Masjid al-Haram mosque encloses the Kaaba, the direction of prayer for Muslims worldwide. In Medina, the Prophet's Mosque (Masjid an-Nabawi) houses among others the tomb of the Prophet. This accompanied circuit brings together visas, flights and accommodation near the Holy Sites for a serene pilgrimage." },
      ar:{ title:'عمرة بريميوم', sub:'دولي · 10-15 يوماً', book:'عمرة بريميوم',
        text:"مكة والمدينة هما المدينتان المقدستان في الإسلام. في مكة، يحيط المسجد الحرام بالكعبة، قبلة المسلمين في العالم أجمع. وفي المدينة، يضم المسجد النبوي قبر النبي. تجمع هذه الجولة المرافقة بين التأشيرات والطيران والإقامة القريبة من الأماكن المقدسة لأداء العمرة بكل اطمئنان." }
    },
    'istanbul-cappadoce': {
      img:'promo/ext-turkey.jpg',
      fr:{ title:'Istanbul - Cappadoce', sub:'International · 8 jours', book:'Istanbul - Cappadoce',
        text:"Assise entre deux continents, Istanbul fut Byzance puis Constantinople avant de devenir la capitale ottomane : Sainte-Sophie, la Mosquée Bleue, le palais de Topkapi et le Grand Bazar. Quelques heures de vol plus loin, la Cappadoce déploie ses cheminées de fée, ses églises troglodytes et ses vallées de tuf rose sur lesquelles flottent les montgolfières." },
      en:{ title:'Istanbul - Cappadocia', sub:'International · 8 days', book:'Istanbul - Cappadocia',
        text:"Straddling two continents, Istanbul was Byzantium then Constantinople before becoming the Ottoman capital: Hagia Sophia, the Blue Mosque, Topkapi Palace and the Grand Bazaar. A few hours' flight away, Cappadocia unfolds its fairy chimneys, cave churches and pink tufa valleys over which hot-air balloons float." },
      ar:{ title:'إسطنبول - كابادوكيا', sub:'دولي · 8 أيام', book:'إسطنبول - كابادوكيا',
        text:"إسطنبول، الواقعة بين قارتين، كانت بيزنطة ثم القسطنطينية قبل أن تصبح عاصمة العثمانيين: آيا صوفيا، المسجد الأزرق، قصر طوب قابي والبازار الكبير. وعلى بعد ساعات طيران، تكشف كابادوكيا عن مداخن الجنيات وكنائسها المنحوتة في الصخر ووديانها الصخرية الوردية التي تحوم فوقها المناطيد." }
    },
    'istanbul-2026': {
      img:'promo/pic-turkey.jpg',
      fr:{ title:'VOYAGE ORGANISÉ ISTANBUL – ÉTÉ 2026', sub:'International · 10 jours · Depuis Annaba dès 149 900 DA', book:'Voyage organisé Istanbul – Été 2026',
        text:"✨ VOYAGE ORGANISÉ ISTANBUL – ÉTÉ 2026 ✨ avec SAINT AUGUSTIN TRAVEL.\n\nProgramme exceptionnel et pour la première fois : 10 jours complets à Istanbul 😍✈️. Départ d'Annaba, à partir de 149 900 DA seulement. Hébergement confortable + excursions touristiques + ambiance inoubliable.",
        info:["📍 Départ d'Annaba","🗓️ 10 jours","🏨 Hôtels 3★ et 4★","💰 Dès 149 900 DA"],
        program:[
          {t:'📅', h:'Dates de départ', d:'♦ Du 24/07 au 03/08/2026\n♦ Du 12/08 au 22/08/2026\n♦ Du 26/08 au 05/09/2026\n♦ Du 04/09 au 14/09/2026'},
          {t:'🏨', h:'Amsterdam Hotel 3★', d:'Chambre double / triple : 149 900 DA\nChambre single : +46 000 DA\nEnfant 2 à 6 ans : 89 000 DA\nEnfant 6 à 11 ans : 119 000 DA'},
          {t:'🏨', h:'Grand Özer Hotel 4★', d:'Chambre double / triple : 157 000 DA\nChambre single : +50 000 DA\nEnfant 2 à 6 ans : 89 000 DA\nEnfant 6 à 11 ans : 125 000 DA'},
          {t:'🏨', h:'Valens Hotel Downtown 4★', d:'Chambre double / triple : 159 900 DA\nChambre single : +55 000 DA\nEnfant 2 à 6 ans : 89 000 DA\nEnfant 6 à 11 ans : 119 900 DA'},
          {t:'🏨', h:'Graziella Gold Hotel 4★', d:'Chambre double / triple : 170 000 DA\nChambre single : +64 000 DA\nEnfant 2 à 6 ans : 89 000 DA\nEnfant 6 à 11 ans : 129 000 DA'},
          {t:'🏨', h:'Trend Hotel 4★', d:'Chambre double / triple : 179 900 DA\nChambre single : +68 000 DA\nEnfant 2 à 6 ans : 89 000 DA\nEnfant 6 à 11 ans : 135 000 DA'},
          {t:'✅', h:'Excursions incluses', d:'City Tour à pied\nMosquée Sultan Ahmet\nSouk El Masri + Grand Bazar\nPalais Topkapi (sans ticket d’entrée)\nAya Sofia\nJournée aux Îles des Princesses + déjeuner\nDîner et soirée bateau sur le Bosphore 💃⛴️\nCroisière sur le Bosphore\nRégion Ortaköy + vue sur le pont suspendu\nAquarium Florya (sans ticket d’entrée)\nOlivium Outlet Center\nPlace Taksim\nCôté asiatique : Camlica, Tour de Léandre, Uskudar\nVenicia Mall'},
          {t:'🌿', h:'Journée optionnelle', d:'Sapanca – Maachoukia avec déjeuner en extra.\nPossibilité de choisir Sapanca & Maachoukia à la place du dîner Bosphore.'},
          {t:'⚠️', h:'Important Visa', d:'Les demandes de visa se font au centre de demandes de visa ; la personne concernée présente sa demande personnellement et non l’agence. Durée du traitement du visa : un mois ou plus.'},
          {t:'📞', h:'Réservation & information', d:'0669 002 117 · 0669 002 118 · 0554 678 921\n📍 SAINT AUGUSTIN TRAVEL – Tourisme & Voyages'}
        ] },
      en:{ title:'ORGANIZED ISTANBUL TRIP – SUMMER 2026', sub:'International · 10 days · From Annaba from 149,900 DZD', book:'Organized Istanbul trip – Summer 2026',
        text:"✨ ORGANIZED ISTANBUL TRIP – SUMMER 2026 ✨ with SAINT AUGUSTIN TRAVEL.\n\nAn exceptional, first-time program: 10 full days in Istanbul 😍✈️. Departure from Annaba, from only 149,900 DZD. Comfortable accommodation + sightseeing tours + an unforgettable atmosphere.",
        info:["📍 Departure from Annaba","🗓️ 10 days","🏨 3★ and 4★ hotels","💰 From 149,900 DZD"],
        program:[
          {t:'📅', h:'Departure dates', d:'♦ From 24/07 to 03/08/2026\n♦ From 12/08 to 22/08/2026\n♦ From 26/08 to 05/09/2026\n♦ From 04/09 to 14/09/2026'},
          {t:'🏨', h:'Amsterdam Hotel 3★', d:'Double / triple room: 149,900 DZD\nSingle room: +46,000 DZD\nChild 2 to 6 years: 89,000 DZD\nChild 6 to 11 years: 119,000 DZD'},
          {t:'🏨', h:'Grand Özer Hotel 4★', d:'Double / triple room: 157,000 DZD\nSingle room: +50,000 DZD\nChild 2 to 6 years: 89,000 DZD\nChild 6 to 11 years: 125,000 DZD'},
          {t:'🏨', h:'Valens Hotel Downtown 4★', d:'Double / triple room: 159,900 DZD\nSingle room: +55,000 DZD\nChild 2 to 6 years: 89,000 DZD\nChild 6 to 11 years: 119,900 DZD'},
          {t:'🏨', h:'Graziella Gold Hotel 4★', d:'Double / triple room: 170,000 DZD\nSingle room: +64,000 DZD\nChild 2 to 6 years: 89,000 DZD\nChild 6 to 11 years: 129,000 DZD'},
          {t:'🏨', h:'Trend Hotel 4★', d:'Double / triple room: 179,900 DZD\nSingle room: +68,000 DZD\nChild 2 to 6 years: 89,000 DZD\nChild 6 to 11 years: 135,000 DZD'},
          {t:'✅', h:'Included excursions', d:'Walking City Tour\nSultan Ahmet Mosque\nSouk El Masri + Grand Bazaar\nTopkapi Palace (without entrance ticket)\nHagia Sophia\nDay at the Princesses’ Isles + lunch\nDinner and boat evening on the Bosphorus 💃⛴️\nBosphorus cruise\nOrtaköy area + view of the suspension bridge\nFlorya Aquarium (without entrance ticket)\nOlivium Outlet Center\nTaksim Square\nAsian side: Camlica, Maiden’s Tower, Uskudar\nVenicia Mall'},
          {t:'🌿', h:'Optional day', d:'Sapanca – Maachoukia with extra lunch.\nPossibility to choose Sapanca & Maachoukia instead of the Bosphorus dinner.'},
          {t:'⚠️', h:'Important Visa', d:'Visa applications are made at the visa application center; the person concerned applies personally and not the agency. Visa processing duration: one month or more.'},
          {t:'📞', h:'Reservation & information', d:'0669 002 117 · 0669 002 118 · 0554 678 921\n📍 SAINT AUGUSTIN TRAVEL – Tourism & Travel'}
        ] },
      ar:{ title:'رحلة منظمة إسطنبول – صيف 2026', sub:'دولي · 10 أيام · انطلاق من عنابة من 149 900 دج', book:'رحلة منظمة إسطنبول – صيف 2026',
        text:"✨ رحلة منظمة إسطنبول – صيف 2026 ✨ مع سانت أوغسطين للسياحة والسفر.\n\nبرنامج استثنائي ولأول مرة: 10 أيام كاملة في إسطنبول 😍✈️. انطلاق من عنابة، ابتداءً من 149 900 دج فقط. إقامة مريحة + رحلات سياحية + أجواء لا تُنسى.",
        info:["📍 انطلاق من عنابة","🗓️ 10 أيام","🏨 فنادق 3 و4 نجوم","💰 ابتداءً من 149 900 دج"],
        program:[
          {t:'📅', h:'تواريخ الانطلاق', d:'♦ من 24/07 إلى 03/08/2026\n♦ من 12/08 إلى 22/08/2026\n♦ من 26/08 إلى 05/09/2026\n♦ من 04/09 إلى 14/09/2026'},
          {t:'🏨', h:'فندق أمستردام 3 نجوم', d:'غرفة مزدوجة / ثلاثية: 149 900 دج\nغرفة فردية: +46 000 دج\nطفل من 2 إلى 6 سنوات: 89 000 دج\nطفل من 6 إلى 11 سنة: 119 000 دج'},
          {t:'🏨', h:'فندق غراند أوزر 4 نجوم', d:'غرفة مزدوجة / ثلاثية: 157 000 دج\nغرفة فردية: +50 000 دج\nطفل من 2 إلى 6 سنوات: 89 000 دج\nطفل من 6 إلى 11 سنة: 125 000 دج'},
          {t:'🏨', h:'فندق فالنس وسط البلد 4 نجوم', d:'غرفة مزدوجة / ثلاثية: 159 900 دج\nغرفة فردية: +55 000 دج\nطفل من 2 إلى 6 سنوات: 89 000 دج\nطفل من 6 إلى 11 سنة: 119 900 دج'},
          {t:'🏨', h:'فندق غرازيلا جولد 4 نجوم', d:'غرفة مزدوجة / ثلاثية: 170 000 دج\nغرفة فردية: +64 000 دج\nطفل من 2 إلى 6 سنوات: 89 000 دج\nطفل من 6 إلى 11 سنة: 129 000 دج'},
          {t:'🏨', h:'فندق تريند 4 نجوم', d:'غرفة مزدوجة / ثلاثية: 179 900 دج\nغرفة فردية: +68 000 دج\nطفل من 2 إلى 6 سنوات: 89 000 دج\nطفل من 6 إلى 11 سنة: 135 000 دج'},
          {t:'✅', h:'الرحلات السياحية المشمولة', d:'جولة في المدينة سيراً على الأقدام\nمسجد السلطان أحمد\nسوق المصري + البازار الكبير\nقصر توبكابي (دون تذكرة دخول)\nآيا صوفيا\nيوم في جزر الأمراء + غداء\nعشاء ومساء بحري على البوسفور 💃⛴️\nرحلة بحرية على البوسفور\nمنطقة أرطأقوي + إطلالة على الجسر المعلق\nأكواريوم فلوريا (دون تذكرة دخول)\nمركز أوليفيوم للبيع\nميدان تقسيم\nالجانب الآسيوي: تشامليجا، برج الفتاة، أسكودار\nمول فينيسيا'},
          {t:'🌿', h:'يوم اختياري', d:'سابانجا – ماعشوقية مع غداء إضافي.\nإمكانية اختيار سابانجا وماعشوقية بدلاً من عشاء البوسفور.'},
          {t:'⚠️', h:'مهم حول التأشيرة', d:'تقدم طلبات التأشيرة في مركز طلبات التأشيرات، والمعني بالأمر هو من يقدم الطلب شخصياً وليس الوكالة. مدة معالجة التأشيرة: شهر أو أكثر.'},
          {t:'📞', h:'الحجز والاستفسار', d:'0669 002 117 · 0669 002 118 · 0554 678 921\n📍 سانت أوغسطين للسفر – سياحة وسفر'}
        ] }
    },
    'hurghada-2026': {
      img:'promo/pic-egypt-hurghada.jpg',
      fr:{ title:'Offre Hurghada – Été 2026 ✈️🇪🇬🌴', sub:'International · 8 nuits · Mer Rouge · Vols directs de Constantine', book:'Offre Hurghada – Été 2026',
        text:"🌴 Offre Hurghada – Été 2026 ✈️🇪🇬\n\nVols directs de Constantine vers Hurghada, 8 nuits dans les plus luxueux hôtels 5★. Soft All Inclusive & Ultra All Inclusive, tous les transferts inclus et visite de Hurghada Marine. Une offre étudiée pour les familles et les jeunes mariés.",
        info:["✈️ Vols directs Constantine","🏖️ 8 nuits · Mer Rouge","🏨 Hôtels 5★","🍽️ All Inclusive","💰 Dès 243 140 DA"],
        program:[
          {t:'ℹ️', h:'L’offre', d:'Vols directs de Constantine à Hurghada\n8 nuits en hôtels 5★ (Soft & Ultra All Inclusive)\nTous les transferts inclus\nVisite de Hurghada Marine 🌊'},
          {t:'💍', h:'Offres spéciales', d:'Offre spéciale pour les jeunes mariés ❤️💍\nRéduction de 10 000 DA pour les familles 👨‍👩‍👧‍👦🎁'},
          {t:'📅', h:'Dates de départ', d:'✈️ 31 juillet 2026\n✈️ 07 août 2026\n✈️ 14 août 2026\n✈️ 21 août 2026\n✈️ 28 août 2026\n✈️ 04 septembre 2026'},
          {t:'🏨', h:'Amwaj Beach Club 5★', d:'Double : 243 140 DA\nTriple : 240 540 DA\nSingle : 315 420 DA\nEnfant 02-05.99 ans : 126 500 DA\nEnfant 06-11.99 ans : 169 820 DA'},
          {t:'🏨', h:'Serenity Alpha Beach 5★', d:'Double : 278 500 DA\nTriple : 275 900 DA\nSingle : 372 100 DA\nEnfant 02-05.99 ans : 126 500 DA\nEnfant 06-11.99 ans : 187 500 DA'},
          {t:'🏨', h:'Serenity Alma Heights 5★', d:'Standard Double : 299 100 DA\nStandard Triple : 296 500 DA\nStandard Single : 393 940 DA\nFamily Room Double : 340 700 DA\nFamily Room Triple : 338 100 DA\nFamily Room Single : 460 500 DA\nEnfant 02-05.99 ans : 131 500 DA\nEnfant 06-11.99 ans : 200 300 DA'},
          {t:'🏨', h:'Serenity Sky Arc 5★', d:'Double : 324 900 DA\nTriple : 322 300 DA\nSingle : 427 220 DA\nEnfant 02-05.99 ans : 136 500 DA\nEnfant 06-11.99 ans : 215 700 DA'},
          {t:'🏨', h:'Tropitel Sahl Hasheesh 5★', d:'Double : 314 500 DA\nTriple : 311 900 DA\nSingle : 410 580 DA\nEnfant 02-05.99 ans : 136 500 DA\nEnfant 06-11.99 ans : 210 500 DA'},
          {t:'🏨', h:'Xanadu Makadi Bay 5★', d:'Superior Garden : D 350 700 · T 348 100 · S 460 500 DA\nSuperior Side Sea : D 371 500 · T 368 900 · S 493 780 DA\nSuperior Sea View : D 392 300 · T 389 700 · S 527 060 DA\nSuperior Swim Up : D 433 900 · T 431 300 · S 593 620 DA\nEnfant 02-05.99 ans : 141 500 DA\nEnfant 06-11.99 ans : de 231 100 à 251 900 DA'},
          {t:'🏨', h:'Xanadu Club 5★', d:'Standard Garden : D 350 700 · T 348 100 · S 460 500 DA\nStandard Pool View : D 361 100 · T 358 500 DA\nStandard Sea View : D 371 500 · T 368 900 · S 493 780 DA\nEnfant 02-05.99 ans : 141 500 DA\nEnfant 06-11.99 ans : à partir de 163 500 DA'},
          {t:'👶', h:'Ticket nourrisson', d:'Bébé (nourrisson) : 25 000 DA'},
          {t:'📞', h:'Réservation & information', d:'☎️ 0669 002 117\n☎️ 0669 002 118\n☎️ 0554 678 921'}
        ] },
      en:{ title:'Hurghada Offer – Summer 2026 ✈️🇪🇬🌴', sub:'International · 8 nights · Red Sea · Direct flights from Constantine', book:'Hurghada Offer – Summer 2026',
        text:"🌴 Hurghada Offer – Summer 2026 ✈️🇪🇬\n\nDirect flights from Constantine to Hurghada, 8 nights in the most luxurious 5★ hotels. Soft All Inclusive & Ultra All Inclusive, all transfers included and a visit to Hurghada Marine. An offer designed for families and newlyweds.",
        info:["✈️ Direct flights Constantine","🏖️ 8 nights · Red Sea","🏨 5★ hotels","🍽️ All Inclusive","💰 From 243,140 DZD"],
        program:[
          {t:'ℹ️', h:'The offer', d:'Direct flights from Constantine to Hurghada\n8 nights in 5★ hotels (Soft & Ultra All Inclusive)\nAll transfers included\nVisit to Hurghada Marine 🌊'},
          {t:'💍', h:'Special offers', d:'Special offer for newlyweds ❤️💍\n10,000 DZD discount for families 👨‍👩‍👧‍👦🎁'},
          {t:'📅', h:'Departure dates', d:'✈️ 31 July 2026\n✈️ 07 August 2026\n✈️ 14 August 2026\n✈️ 21 August 2026\n✈️ 28 August 2026\n✈️ 04 September 2026'},
          {t:'🏨', h:'Amwaj Beach Club 5★', d:'Double: 243,140 DZD\nTriple: 240,540 DZD\nSingle: 315,420 DZD\nChild 02-05.99 yrs: 126,500 DZD\nChild 06-11.99 yrs: 169,820 DZD'},
          {t:'🏨', h:'Serenity Alpha Beach 5★', d:'Double: 278,500 DZD\nTriple: 275,900 DZD\nSingle: 372,100 DZD\nChild 02-05.99 yrs: 126,500 DZD\nChild 06-11.99 yrs: 187,500 DZD'},
          {t:'🏨', h:'Serenity Alma Heights 5★', d:'Standard Double: 299,100 DZD\nStandard Triple: 296,500 DZD\nStandard Single: 393,940 DZD\nFamily Room Double: 340,700 DZD\nFamily Room Triple: 338,100 DZD\nFamily Room Single: 460,500 DZD\nChild 02-05.99 yrs: 131,500 DZD\nChild 06-11.99 yrs: 200,300 DZD'},
          {t:'🏨', h:'Serenity Sky Arc 5★', d:'Double: 324,900 DZD\nTriple: 322,300 DZD\nSingle: 427,220 DZD\nChild 02-05.99 yrs: 136,500 DZD\nChild 06-11.99 yrs: 215,700 DZD'},
          {t:'🏨', h:'Tropitel Sahl Hasheesh 5★', d:'Double: 314,500 DZD\nTriple: 311,900 DZD\nSingle: 410,580 DZD\nChild 02-05.99 yrs: 136,500 DZD\nChild 06-11.99 yrs: 210,500 DZD'},
          {t:'🏨', h:'Xanadu Makadi Bay 5★', d:'Superior Garden: D 350,700 · T 348,100 · S 460,500 DZD\nSuperior Side Sea: D 371,500 · T 368,900 · S 493,780 DZD\nSuperior Sea View: D 392,300 · T 389,700 · S 527,060 DZD\nSuperior Swim Up: D 433,900 · T 431,300 · S 593,620 DZD\nChild 02-05.99 yrs: 141,500 DZD\nChild 06-11.99 yrs: from 231,100 to 251,900 DZD'},
          {t:'🏨', h:'Xanadu Club 5★', d:'Standard Garden: D 350,700 · T 348,100 · S 460,500 DZD\nStandard Pool View: D 361,100 · T 358,500 DZD\nStandard Sea View: D 371,500 · T 368,900 · S 493,780 DZD\nChild 02-05.99 yrs: 141,500 DZD\nChild 06-11.99 yrs: from 163,500 DZD'},
          {t:'👶', h:'Infant ticket', d:'Baby (infant): 25,000 DZD'},
          {t:'📞', h:'Reservation & information', d:'☎️ 0669 002 117\n☎️ 0669 002 118\n☎️ 0554 678 921'}
        ] },
      ar:{ title:'عرض الغردقة – صيف 2026 ✈️🇪🇬🌴', sub:'دولي · 8 ليالٍ · البحر الأحمر · رحلات مباشرة من قسنطينة', book:'عرض الغردقة – صيف 2026',
        text:"🌴 عرض الغردقة صيف 2026 ✈️🇪🇬\n\nرحلات مباشرة من قسنطينة إلى الغردقة، إقامة 8 ليالٍ في أفخم فنادق 5 نجوم. شاملة الكل وللعرسان، جميع التحويلات مشمولة وزيارة هيدرا مارين. عرض مخصص للعائلات والعرسان الجدد.",
        info:["✈️ رحلات مباشرة قسنطينة","🏖️ 8 ليالٍ · البحر الأحمر","🏨 فنادق 5 نجوم","🍽️ شاملة الكل","💰 ابتداءً من 243 140 دج"],
        program:[
          {t:'ℹ️', h:'العرض', d:'رحلات مباشرة من قسنطينة إلى الغردقة\n8 ليالٍ في فنادق 5 نجوم (شاملة الكل)\nجميع التحويلات مشمولة\nزيارة هيدرا مارين 🌊'},
          {t:'💍', h:'عروض خاصة', d:'عرض خاص للعرسان الجدد ❤️💍\nتخفيض 10 000 دج للعائلات 👨‍👩‍👧‍👦🎁'},
          {t:'📅', h:'تواريخ الانطلاق', d:'✈️ 31 جويلية 2026\n✈️ 07 أوت 2026\n✈️ 14 أوت 2026\n✈️ 21 أوت 2026\n✈️ 28 أوت 2026\n✈️ 04 سبتمبر 2026'},
          {t:'🏨', h:'فندق أمواج بيتش كلوب 5 نجوم', d:'دبل: 243 140 دج\nتريبل: 240 540 دج\nفردي: 315 420 دج\nطفل 02-05.99 سنة: 126 500 دج\nطفل 06-11.99 سنة: 169 820 دج'},
          {t:'🏨', h:'فندق سيرينيتي ألفا بيتش 5 نجوم', d:'دبل: 278 500 دج\nتريبل: 275 900 دج\nفردي: 372 100 دج\nطفل 02-05.99 سنة: 126 500 دج\nطفل 06-11.99 سنة: 187 500 دج'},
          {t:'🏨', h:'فندق سيرينيتي المنى هايتس 5 نجوم', d:'ستاندرد دبل: 299 100 دج\nستاندرد تريبل: 296 500 دج\nستاندرد فردي: 393 940 دج\nغرفة عائلية دبل: 340 700 دج\nغرفة عائلية تريبل: 338 100 دج\nغرفة عائلية فردي: 460 500 دج\nطفل 02-05.99 سنة: 131 500 دج\nطفل 06-11.99 سنة: 200 300 دج'},
          {t:'🏨', h:'فندق سيرينيتي سكاي آرك 5 نجوم', d:'دبل: 324 900 دج\nتريبل: 322 300 دج\nفردي: 427 220 دج\nطفل 02-05.99 سنة: 136 500 دج\nطفل 06-11.99 سنة: 215 700 دج'},
          {t:'🏨', h:'فندق تروبيتيل ساهل حشيش 5 نجوم', d:'دبل: 314 500 دج\nتريبل: 311 900 دج\nفردي: 410 580 دج\nطفل 02-05.99 سنة: 136 500 دج\nطفل 06-11.99 سنة: 210 500 دج'},
          {t:'🏨', h:'فندق زانادو مكادي باي 5 نجوم', d:'سوبيريور جاردن: د 350 700 · ت 348 100 · ف 460 500 دج\nسوبيريور سايد سي: د 371 500 · ت 368 900 · ف 493 780 دج\nسوبيريور سي فيو: د 392 300 · ت 389 700 · ف 527 060 دج\nسوبيريور سويم أب: د 433 900 · ت 431 300 · ف 593 620 دج\nطفل 02-05.99 سنة: 141 500 دج\nطفل 06-11.99 سنة: من 231 100 إلى 251 900 دج'},
          {t:'🏨', h:'فندق زانادو كلوب 5 نجوم', d:'ستاندرد جاردن: د 350 700 · ت 348 100 · ف 460 500 دج\nستاندرد بول فيو: د 361 100 · ت 358 500 دج\nستاندرد سي فيو: د 371 500 · ت 368 900 · ف 493 780 دج\nطفل 02-05.99 سنة: 141 500 دج\nطفل 06-11.99 سنة: ابتداءً من 163 500 دج'},
          {t:'👶', h:'تذكرة الرضيع', d:'الرضيع: 25 000 دج'},
          {t:'📞', h:'الحجز والاستفسار', d:'☎️ 0669 002 117\n☎️ 0669 002 118\n☎️ 0554 678 921'}
        ] }
    },
    'sharm-caire-2026': {
      img:'promo/pic-egypt-sharm.jpg',
      fr:{ title:'Sharm El Sheikh & Caire 2026 🇪🇬', sub:'International · Égypte · Vol direct Alger', book:'Sharm El Sheikh & Caire 2026',
        info:["🏝️ Sharm El Sheikh · Égypte","🗓️ 10 jours / 9 nuits","✈️ Vol direct Alger","🏨 4★ & 5★","💰 Dès 195 000 DA"],
        program:[
          {t:'ℹ️', h:'Offre 1 – Parrotel Aqua Park 4★', d:'10 jours / 9 nuits · Dates : 04 · 11 · 16 · 26 septembre 2026\nVol aller-retour AJet Airlines · Bagages 40 kg\nAccueil et assistance à l’aéroport\nAll Inclusive Soft · Transfert aéroport ⇄ hôtel\n3 excursions avec guide professionnel arabophone'},
          {t:'💰', h:'Tarifs – Parrotel', d:'Adulte Double 195 000 · Triple 193 000 · Single 253 000\nEnfant 6–11.99 135 000 · 2–5.99 82 000 · Nourrisson 30 000\n🎁 Commissions : Adulte 10 000 · Enfant 5 000'},
          {t:'ℹ️', h:'Offre 2 – Sharm & Caire 2026', d:'Programme 10 jours · Vol direct Alger–Le Caire–Sharm–Le Caire–Alger (Egyptair)\n2 nuits au Caire (Stay Inn Pyramids Giza 4★) + 7 nuits à Sharm, all inclusive soft\nTransfert aéroport–hôtel–aéroport en bus confortable'},
          {t:'✅', h:'Inclus', d:'Lettre de garantie\nAccompagnateur durant le séjour\nExcursions Soho Square · Old Market · mosquée Sahaba\nVisites au Caire : Pyramides, Sphinx, Musée Égyptien, Khan el Khalili\nDîner-croisière · Déjeuner buffet avec boissons'},
          {t:'🛂', h:'Visa', d:'Visa d’entrée non inclus : 30 $ (paiement à l’aéroport)'},
          {t:'📅', h:'Dates de départ', d:'✈ Du 22 Août au 31 Août\n✈ Du 04 Septembre au 13 Septembre\nPlaces limitées ❌'},
          {t:'🏨', h:'TIVOLI 4★', d:'Adulte Double 229 000 · Triple 227 000 · Single 269 000\nEnfant 2–5.99 139 000 · 6–11.99 169 000 · 2ème 189 000 · 0–1.99 45 000'},
          {t:'🏨', h:'Rehana Sharm Resort 4★', d:'Adulte Double 269 000 · Triple 259 000 · Single 319 000\nEnfant 2–5.99 139 000 · 6–11.99 169 000 · 2ème 189 000 · 0–1.99 45 000'},
          {t:'🏨', h:'Rehana Royal Beach Aqua Park 5★', d:'Adulte Double 289 000 · Triple 287 000 · Single 359 000\nEnfant 2–5.99 139 000 · 6–11.99 169 000 · 2ème 219 000 · 0–1.99 45 000'},
          {t:'🏨', h:'Coral Sea Aqua Club 4★', d:'Adulte Double 329 000 · Triple 319 000 · Single 429 000\nEnfant 2–5.99 139 000 · 6–11.99 169 000 · 2ème 229 000 · 0–1.99 45 000'},
          {t:'🏨', h:'Coral Sea Holiday Resort 5★', d:'Adulte Double 349 000 · Triple 345 000 · Single 479 000\nEnfant 2–5.99 139 000 · 6–11.99 169 000 · 2ème 249 000 · 0–1.99 45 000'},
          {t:'🏨', h:'Cleopatra Luxury 5★', d:'Adulte Double 339 000 · Triple 335 000 · Single 449 000\nEnfant 2–5.99 139 000 · 6–11.99 169 000 · 2ème 239 000 · 0–1.99 45 000'},
          {t:'🏨', h:'Coral Sea Water World Resort 5★', d:'Adulte Double 369 000 · Triple 365 000 · Single 499 000\nEnfant 2–5.99 139 000 · 6–11.99 169 000 · 2ème 249 000 · 0–1.99 45 000'},
          {t:'🏨', h:'Concorde El Salam Sport 5★', d:'Adulte Double 309 000 · Triple 305 000 · Single 389 000\nEnfant 2–5.99 139 000 · 6–11.99 169 000 · 2ème 219 000 · 0–1.99 45 000'},
          {t:'🏨', h:'Pickalbatros Laguna Vista 5★', d:'💰 Sur demande'},
          {t:'📞', h:'Réservation & information', d:'☎️ 0669 002 118 · 0554 678 921 · 0669 002 117\n📧 commercial.staugustin@gmail.com'}
        ] },
      en:{ title:'Sharm El Sheikh & Cairo 2026 🇪🇬', sub:'International · Egypt · Direct flight Algiers', book:'Sharm El Sheikh & Cairo 2026',
        info:["🏝️ Sharm El Sheikh · Egypt","🗓️ 10 days / 9 nights","✈️ Direct flight Algiers","🏨 4★ & 5★","💰 From 195,000 DZD"],
        program:[
          {t:'ℹ️', h:'Offer 1 – Parrotel Aqua Park 4★', d:'10 days / 9 nights · Dates: 04 · 11 · 16 · 26 September 2026\nRound-trip flight AJet Airlines · 40 kg baggage\nAirport welcome and assistance\nAll Inclusive Soft · Airport ⇄ hotel transfer\n3 excursions with a professional Arabic-speaking guide'},
          {t:'💰', h:'Prices – Parrotel', d:'Adult Double 195,000 · Triple 193,000 · Single 253,000\nChild 6–11.99 135,000 · 2–5.99 82,000 · Infant 30,000\n🎁 Commissions: Adult 10,000 · Child 5,000'},
          {t:'ℹ️', h:'Offer 2 – Sharm & Cairo 2026', d:'10-day program · Direct flight Algiers–Cairo–Sharm–Cairo–Algiers (Egyptair)\n2 nights in Cairo (Stay Inn Pyramids Giza 4★) + 7 nights in Sharm, all inclusive soft\nAirport–hotel–airport transfer in a comfortable bus'},
          {t:'✅', h:'Included', d:'Guarantee letter\nA companion throughout the stay\nExcursions Soho Square · Old Market · Sahaba Mosque\nCairo visits: Pyramids, Sphinx, Egyptian Museum, Khan el Khalili\nDinner cruise · Open buffet lunch with drinks'},
          {t:'🛂', h:'Visa', d:'Entry visa NOT included: $30 (to be paid at the airport)'},
          {t:'📅', h:'Departure dates', d:'✈ From 22 August to 31 August\n✈ From 04 September to 13 September\nLimited places ❌'},
          {t:'🏨', h:'TIVOLI 4★', d:'Adult Double 229,000 · Triple 227,000 · Single 269,000\nChild 2–5.99 139,000 · 6–11.99 169,000 · 2nd 189,000 · 0–1.99 45,000'},
          {t:'🏨', h:'Rehana Sharm Resort 4★', d:'Adult Double 269,000 · Triple 259,000 · Single 319,000\nChild 2–5.99 139,000 · 6–11.99 169,000 · 2nd 189,000 · 0–1.99 45,000'},
          {t:'🏨', h:'Rehana Royal Beach Aqua Park 5★', d:'Adult Double 289,000 · Triple 287,000 · Single 359,000\nChild 2–5.99 139,000 · 6–11.99 169,000 · 2nd 219,000 · 0–1.99 45,000'},
          {t:'🏨', h:'Coral Sea Aqua Club 4★', d:'Adult Double 329,000 · Triple 319,000 · Single 429,000\nChild 2–5.99 139,000 · 6–11.99 169,000 · 2nd 229,000 · 0–1.99 45,000'},
          {t:'🏨', h:'Coral Sea Holiday Resort 5★', d:'Adult Double 349,000 · Triple 345,000 · Single 479,000\nChild 2–5.99 139,000 · 6–11.99 169,000 · 2nd 249,000 · 0–1.99 45,000'},
          {t:'🏨', h:'Cleopatra Luxury 5★', d:'Adult Double 339,000 · Triple 335,000 · Single 449,000\nChild 2–5.99 139,000 · 6–11.99 169,000 · 2nd 239,000 · 0–1.99 45,000'},
          {t:'🏨', h:'Coral Sea Water World Resort 5★', d:'Adult Double 369,000 · Triple 365,000 · Single 499,000\nChild 2–5.99 139,000 · 6–11.99 169,000 · 2nd 249,000 · 0–1.99 45,000'},
          {t:'🏨', h:'Concorde El Salam Sport 5★', d:'Adult Double 309,000 · Triple 305,000 · Single 389,000\nChild 2–5.99 139,000 · 6–11.99 169,000 · 2nd 219,000 · 0–1.99 45,000'},
          {t:'🏨', h:'Pickalbatros Laguna Vista 5★', d:'💰 On request'},
          {t:'📞', h:'Reservation & information', d:'☎️ 0669 002 118 · 0554 678 921 · 0669 002 117\n📧 commercial.staugustin@gmail.com'}
        ] },
      ar:{ title:'شرم الشيخ والقاهرة 2026 🇪🇬', sub:'دولي · مصر · رحلة مباشرة الجزائر', book:'شرم الشيخ والقاهرة 2026',
        info:["🏝️ شرم الشيخ · مصر","🗓️ 10 أيام / 9 ليالٍ","✈️ رحلة مباشرة الجزائر","🏨 4 و5 نجوم","💰 ابتداءً من 195 000 دج"],
        program:[
          {t:'ℹ️', h:'العرض 1 – باروتيل أكوا بارك 4 نجوم', d:'10 أيام / 9 ليالٍ · التواريخ: 04 · 11 · 16 · 26 سبتمبر 2026\nرحلة ذهاب وعودة AJet · أمتعة 40 كغ\nاستقبال ومساعدة في المطار\nشاملة الكل · نقل المطار ⇄ الفندق\n3 رحلات سياحية مع مرشد ناطق بالعربية'},
          {t:'💰', h:'الأسعار – باروتيل', d:'بالغ دبل 195 000 · تريبل 193 000 · فردي 253 000\nطفل 6–11.99 135 000 · 2–5.99 82 000 · رضيع 30 000\n🎁 عمولات: بالغ 10 000 · طفل 5 000'},
          {t:'ℹ️', h:'العرض 2 – شرم الشيخ والقاهرة 2026', d:'برنامج 10 أيام · رحلة مباشرة الجزائر–القاهرة–شرم–القاهرة–الجزائر (مصر للطيران)\nليلتان في القاهرة (ستاي إن بيراميدز جيزا 4 نجوم) + 7 ليالٍ في شرم، شاملة الكل\nتحويل المطار–الفندق–المطار بحافلة مريحة'},
          {t:'✅', h:'مشمول', d:'خطاب ضمان\nمرافق طوال الإقامة\nرحلات سوهو سكوير · السوق القديم · مسجد الصحابة\nزيارات القاهرة: الأهرامات، أبو الهول، المتحف المصري، خان الخليلي\nعشاء بحري · غداء بوفيه مع مشروبات'},
          {t:'🛂', h:'التأشيرة', d:'تأشيرة الدخول غير مشمولة: 30 دولار (تُدفع في المطار)'},
          {t:'📅', h:'تواريخ الانطلاق', d:'✈ من 22 أوت إلى 31 أوت\n✈ من 04 سبتمبر إلى 13 سبتمبر\nالأماكن محدودة ❌'},
          {t:'🏨', h:'تيفولي 4 نجوم', d:'بالغ دبل 229 000 · تريبل 227 000 · فردي 269 000\nطفل 2–5.99 139 000 · 6–11.99 169 000 · الثاني 189 000 · رضيع 45 000'},
          {t:'🏨', h:'ريحانة شرم ريزورت 4 نجوم', d:'بالغ دبل 269 000 · تريبل 259 000 · فردي 319 000\nطفل 2–5.99 139 000 · 6–11.99 169 000 · الثاني 189 000 · رضيع 45 000'},
          {t:'🏨', h:'ريحانة رويال بيتش أكوا بارك 5 نجوم', d:'بالغ دبل 289 000 · تريبل 287 000 · فردي 359 000\nطفل 2–5.99 139 000 · 6–11.99 169 000 · الثاني 219 000 · رضيع 45 000'},
          {t:'🏨', h:'كورال سي أكوا كلوب 4 نجوم', d:'بالغ دبل 329 000 · تريبل 319 000 · فردي 429 000\nطفل 2–5.99 139 000 · 6–11.99 169 000 · الثاني 229 000 · رضيع 45 000'},
          {t:'🏨', h:'كورال سي هوليداي ريزورت 5 نجوم', d:'بالغ دبل 349 000 · تريبل 345 000 · فردي 479 000\nطفل 2–5.99 139 000 · 6–11.99 169 000 · الثاني 249 000 · رضيع 45 000'},
          {t:'🏨', h:'كليوباترا لوكشري 5 نجوم', d:'بالغ دبل 339 000 · تريبل 335 000 · فردي 449 000\nطفل 2–5.99 139 000 · 6–11.99 169 000 · الثاني 239 000 · رضيع 45 000'},
          {t:'🏨', h:'كورال سي ووتر ورلد ريزورت 5 نجوم', d:'بالغ دبل 369 000 · تريبل 365 000 · فردي 499 000\nطفل 2–5.99 139 000 · 6–11.99 169 000 · الثاني 249 000 · رضيع 45 000'},
          {t:'🏨', h:'كونكورد السلام سبورت 5 نجوم', d:'بالغ دبل 309 000 · تريبل 305 000 · فردي 389 000\nطفل 2–5.99 139 000 · 6–11.99 169 000 · الثاني 219 000 · رضيع 45 000'},
          {t:'🏨', h:'بيكالاتبروس لاغونا فيستا 5 نجوم', d:'💰 عند الطلب'},
          {t:'📞', h:'الحجز والاستفسار', d:'☎️ 0669 002 118 · 0554 678 921 · 0669 002 117\n📧 commercial.staugustin@gmail.com'}
        ] }
    },'tunisie-2026': {
      img:'promo/pic-tunisia.jpg',
      fr:{ title:'Tunisie Summer 2026 🇹🇳🔥', sub:'International · 6 nuits / 7 jours · Sousse', book:'Tunisie Summer 2026',
        text:"🇹🇳 TUNISIE SUMMER 2026 — avec Saint Augustin Tourisme & Voyages.\n\nSousse, Hammamet, Nabeul : 6 nuits / 7 jours. Transport confortable, hôtels choisis, sorties et ambiance familiale. Dès 51 900 DA seulement. Le ne manquez pas cette occasion : la Tunisie vous attend avec de belles offres, la mer, le repos et de magnifiques sorties. Places limitées, réservation ouverte dès maintenant.",
        info:["🏖️ Sousse · Hammamet · Nabeul","🗓️ 6 nuits / 7 jours","🚍 Transport confortable","🧳 Sorties incluses","💰 Dès 51 900 DA"],
        program:[
          {t:'📅', h:'Dates de départ', d:'✅ 02/07 → 09/07\n✅ 06/07 → 13/07\n✅ 10/07 → 17/07\n✅ 14/07 → 21/07\n✅ 15/07 → 22/07\n✅ 22/07 → 29/07\n✅ 29/07 → 05/08\n✅ 05/08 → 12/08\n✅ 12/08 → 19/08\n✅ 19/08 → 26/08\n✅ 26/08 → 02/09'},
          {t:'🏨', h:'SOL PALMYRAS – Sousse', d:'(02/07→13/07) Double 51 900 · Triple 53 900 · Enfant 8 000 · 2ème enfant 33 900 · Single 78 900 · All Soft +18 000\n(10/07→02/09) Double 73 900 · Triple 75 900 · Enfant 10 000 · 2ème enfant 44 900 · Single 107 900 · All Soft +7 000'},
          {t:'🏨', h:'KANTAOUI CENTER – Sousse', d:'(02/07→13/07) Double 59 500 · Triple 60 500 · Enfant 8 000 · 2ème enfant 37 000 · Supp. Single +27 000 · 1er enfant 0-6 ans gratuit\n(10/07→02/09) Double 67 000 · Triple 68 000 · Enfant 10 000 · 2ème enfant 40 900 · Supp. Single +36 900'},
          {t:'🏨', h:'EL MOURADI CLUB EL KANTAOUI – Sousse', d:'(02/07→13/07) Double 92 900 · Triple 90 900 · Enfant 8 000 · 2ème enfant 55 900 · Single 145 900 · Bloc Central +10 000\n(10/07→02/09) Double 115 900 · Triple 113 900 · Enfant 10 000 · 2ème enfant 68 900 · Single 167 900 · Bloc Central +15 000'},
          {t:'🏨', h:'ORIENT – Sousse', d:'(02/07→13/07) Double 59 000 · Triple 58 000 · Enfant 8 000 · 2ème enfant 22 000 · Supp. Single +24 000 · All Soft +10 000\n(10/07→02/09) Double 98 500 · Triple 97 000 · Enfant 10 000 · 2ème enfant 57 500 · Supp. Single +27 000 · All Soft +27 000'},
          {t:'🏨', h:'MARABOUT – Sousse', d:'(02/07) Double 118 600 · Triple 117 000 · Enfant 10 000 · 2ème enfant 66 500 · Single 159 900 · Bloc Central +10 900\n(06/07) Double 124 000 · Triple 122 000 · Enfant 10 000 · 2ème enfant 75 500 · Single 159 900 · Bloc Central +15 000'},
          {t:'🏨', h:'EL MOURADI CLUB SELIMA – Sousse', d:'(02/07→13/07) Double 81 000 · Triple 82 500 · Enfant 8 000 · 2ème enfant 48 500 · Supp. Single +44 000 · All Soft +44 000\n(10/07→02/09) Double 96 000 · Triple 97 500 · Enfant 10 000 · 2ème enfant 55 500 · Supp. Single +44 000'},
          {t:'🎁', h:'Avantages de l’offre', d:'Hôtels choisis et confortables\nTransport Premium\nSorties incluses\nAmbiance familiale\nOffres adaptées aux familles et enfants\nTarifs selon hôtel et date\nRéservation ouverte, places limitées'},
          {t:'📌', h:'Note importante', d:'Les prix sont selon disponibilité et peuvent changer. La réservation doit être anticipée pour confirmer les places.'},
          {t:'📞', h:'Réservation & information', d:'☎️ 0669 00 21 17\n☎️ 0669 00 21 18\n☎️ 0554 67 89 21'}
        ] },
      en:{ title:'Tunisia Summer 2026 🇹🇳🔥', sub:'International · 6 nights / 7 days · Sousse', book:'Tunisia Summer 2026',
        text:"🇹🇳 TUNISIA SUMMER 2026 — with Saint Augustin Tourisme & Voyages.\n\nSousse, Hammamet, Nabeul: 6 nights / 7 days. Comfortable transport, selected hotels, excursions and family atmosphere. From only 51,900 DZD. Don't miss this opportunity: Tunisia awaits you with great offers, sea, rest and wonderful trips. Limited places, booking open now.",
        info:["🏖️ Sousse · Hammamet · Nabeul","🗓️ 6 nights / 7 days","🚍 Comfortable transport","🧳 Excursions included","💰 From 51,900 DZD"],
        program:[
          {t:'📅', h:'Departure dates', d:'✅ 02/07 → 09/07\n✅ 06/07 → 13/07\n✅ 10/07 → 17/07\n✅ 14/07 → 21/07\n✅ 15/07 → 22/07\n✅ 22/07 → 29/07\n✅ 29/07 → 05/08\n✅ 05/08 → 12/08\n✅ 12/08 → 19/08\n✅ 19/08 → 26/08\n✅ 26/08 → 02/09'},
          {t:'🏨', h:'SOL PALMYRAS – Sousse', d:'(02/07→13/07) Double 51,900 · Triple 53,900 · Child 8,000 · 2nd child 33,900 · Single 78,900 · All Soft +18,000\n(10/07→02/09) Double 73,900 · Triple 75,900 · Child 10,000 · 2nd child 44,900 · Single 107,900 · All Soft +7,000'},
          {t:'🏨', h:'KANTAOUI CENTER – Sousse', d:'(02/07→13/07) Double 59,500 · Triple 60,500 · Child 8,000 · 2nd child 37,000 · Single supp. +27,000 · 1st child 0-6 free\n(10/07→02/09) Double 67,000 · Triple 68,000 · Child 10,000 · 2nd child 40,900 · Single supp. +36,900'},
          {t:'🏨', h:'EL MOURADI CLUB EL KANTAOUI – Sousse', d:'(02/07→13/07) Double 92,900 · Triple 90,900 · Child 8,000 · 2nd child 55,900 · Single 145,900 · Central Block +10,000\n(10/07→02/09) Double 115,900 · Triple 113,900 · Child 10,000 · 2nd child 68,900 · Single 167,900 · Central Block +15,000'},
          {t:'🏨', h:'ORIENT – Sousse', d:'(02/07→13/07) Double 59,000 · Triple 58,000 · Child 8,000 · 2nd child 22,000 · Single supp. +24,000 · All Soft +10,000\n(10/07→02/09) Double 98,500 · Triple 97,000 · Child 10,000 · 2nd child 57,500 · Single supp. +27,000 · All Soft +27,000'},
          {t:'🏨', h:'MARABOUT – Sousse', d:'(02/07) Double 118,600 · Triple 117,000 · Child 10,000 · 2nd child 66,500 · Single 159,900 · Central Block +10,900\n(06/07) Double 124,000 · Triple 122,000 · Child 10,000 · 2nd child 75,500 · Single 159,900 · Central Block +15,000'},
          {t:'🏨', h:'EL MOURADI CLUB SELIMA – Sousse', d:'(02/07→13/07) Double 81,000 · Triple 82,500 · Child 8,000 · 2nd child 48,500 · Single supp. +44,000 · All Soft +44,000\n(10/07→02/09) Double 96,000 · Triple 97,500 · Child 10,000 · 2nd child 55,500 · Single supp. +44,000'},
          {t:'🎁', h:'Offer advantages', d:'Selected and comfortable hotels\nPremium transport\nExcursions included\nFamily atmosphere\nOffers suited to families and children\nRates according to hotel and date\nBooking open, limited places'},
          {t:'📌', h:'Important note', d:'Prices depend on availability and may change. Booking must be made in advance to confirm seats.'},
          {t:'📞', h:'Reservation & information', d:'☎️ 0669 00 21 17\n☎️ 0669 00 21 18\n☎️ 0554 67 89 21'}
        ] },
      ar:{ title:'تونس صيف 2026 🇹🇳🔥', sub:'دولي · 6 ليالٍ / 7 أيام · سوسة', book:'تونس صيف 2026',
        text:"🇹🇳 تونس صيف 2026 — مع وكالة سانت أوغسطين للسياحة والسفر.\n\nسوسة، الحمامات، نابل: 6 ليالٍ / 7 أيام. نقل مريح + فنادق مختارة + خرجات سياحية + أجواء عائلية. ابتداءً من 51 900 دج فقط. الصيف هذا لا تضيعوا الفرصة… تونس تستناكم بعروض قوية وفنادق مريحة وبحر وراحة وخرجات وأجواء عائلية رائعة. الأماكن محدودة والحجز مفتوح من الآن.",
        info:["🏖️ سوسة · الحمامات · نابل","🗓️ 6 ليالٍ / 7 أيام","🚍 نقل مريح","🧳 خرجات مشمولة","💰 ابتداءً من 51 900 دج"],
        program:[
          {t:'📅', h:'تواريخ الانطلاق', d:'✅ 02/07 → 09/07\n✅ 06/07 → 13/07\n✅ 10/07 → 17/07\n✅ 14/07 → 21/07\n✅ 15/07 → 22/07\n✅ 22/07 → 29/07\n✅ 29/07 → 05/08\n✅ 05/08 → 12/08\n✅ 12/08 → 19/08\n✅ 19/08 → 26/08\n✅ 26/08 → 02/09'},
          {t:'🏨', h:'سول بالميراس – سوسة', d:'(02/07→13/07) دبل 51 900 · تريبل 53 900 · طفل 8 000 · الطفل الثاني 33 900 · فردي 78 900 · شاملة الكل +18 000\n(10/07→02/09) دبل 73 900 · تريبل 75 900 · طفل 10 000 · الطفل الثاني 44 900 · فردي 107 900 · شاملة الكل +7 000'},
          {t:'🏨', h:'قنطاوي سنتر – سوسة', d:'(02/07→13/07) دبل 59 500 · تريبل 60 500 · طفل 8 000 · الطفل الثاني 37 000 · إضافي فردي +27 000 · الطفل الأول 0-6 مجاني\n(10/07→02/09) دبل 67 000 · تريبل 68 000 · طفل 10 000 · الطفل الثاني 40 900 · إضافي فردي +36 900'},
          {t:'🏨', h:'المرادي كلوب القنطاوي – سوسة', d:'(02/07→13/07) دبل 92 900 · تريبل 90 900 · طفل 8 000 · الطفل الثاني 55 900 · فردي 145 900 · بلوك مركزي +10 000\n(10/07→02/09) دبل 115 900 · تريبل 113 900 · طفل 10 000 · الطفل الثاني 68 900 · فردي 167 900 · بلوك مركزي +15 000'},
          {t:'🏨', h:'أورينت – سوسة', d:'(02/07→13/07) دبل 59 000 · تريبل 58 000 · طفل 8 000 · الطفل الثاني 22 000 · إضافي فردي +24 000 · شاملة الكل +10 000\n(10/07→02/09) دبل 98 500 · تريبل 97 000 · طفل 10 000 · الطفل الثاني 57 500 · إضافي فردي +27 000 · شاملة الكل +27 000'},
          {t:'🏨', h:'مربوط – سوسة', d:'(02/07) دبل 118 600 · تريبل 117 000 · طفل 10 000 · الطفل الثاني 66 500 · فردي 159 900 · بلوك مركزي +10 900\n(06/07) دبل 124 000 · تريبل 122 000 · طفل 10 000 · الطفل الثاني 75 500 · فردي 159 900 · بلوك مركزي +15 000'},
          {t:'🏨', h:'المرادي كلوب سليمة – سوسة', d:'(02/07→13/07) دبل 81 000 · تريبل 82 500 · طفل 8 000 · الطفل الثاني 48 500 · إضافي فردي +44 000 · شاملة الكل +44 000\n(10/07→02/09) دبل 96 000 · تريبل 97 500 · طفل 10 000 · الطفل الثاني 55 500 · إضافي فردي +44 000'},
          {t:'🎁', h:'مزايا العرض', d:'فنادق مختارة ومريحة\nنقل مريح Premium\nخرجات سياحية مشمولة\nأجواء عائلية\nعروض مناسبة للعائلات والأطفال\nأسعار حسب الفندق والتاريخ\nالحجز مفتوح والأماكن محدودة'},
          {t:'📌', h:'ملاحظة مهمة', d:'الأسعار حسب التوفر وقابلة للتغيير، والحجز مسبقًا لتأكيد المقاعد.'},
          {t:'📞', h:'الحجز والاستفسار', d:'☎️ 0669 00 21 17\n☎️ 0669 00 21 18\n☎️ 0554 67 89 21'}
        ] }
    },
    'azerbaijan-2026': {
      img:'promo/pic-azerbaijan.jpg',
      fr:{ title:'Azerbaïdjan – Bakou & Gabala 🇦🇿✨', sub:'International · 7 nuits · AJet', book:'Azerbaïdjan – Bakou & Gabala',
        text:"🇦🇿 AZERBAÏDJAN | BAKOU & GABALA ✨\n\nUn programme touristique exceptionnel pour découvrir la beauté de l’Azerbaïdjan : le charme des villes, la splendeur de la nature et la magie du pays.",
        info:["🗓️ 7 nuits","🏨 B&B Bakou 5 n. + Gabala 2 n.","🚌 Transport & guide","🛂 Visa électronique inclus","💰 Dès 209 000 DA"],
        program:[
          {t:'📅', h:'Date de voyage', d:'Dimanche 30 août 2026'},
          {t:'✈️', h:'Le programme inclut', d:'Billet d’avion sur AJet Airlines\nTransfert aéroport ⇄ hôtel\nDéplacements inter-villes en bus touristique confortable\nHébergement à Bakou : 5 nuits avec petit-déjeuner\nHébergement à Gabala : 2 nuits avec petit-déjeuner\nGuide touristique + accompagnement et assistance tout au long du voyage\nExcursions et visites pendant le séjour\nVisa électronique inclus 🛂'},
          {t:'💰', h:'Tarifs', d:'Adulte – chambre double : 209 000 DA\nAdulte – chambre triple : 205 000 DA\nAdulte – chambre single : 269 000 DA\nNourrisson / enfant 0–5.99 ans : 40 000 DA\n2ème enfant 6–11.99 ans : 155 000 DA'},
          {t:'✨', h:'Bakou & Gabala', d:'Un voyage qui allie le charme des villes, la beauté de la nature et l’émerveillement de l’Azerbaïdjan ! 🇦🇿'},
          {t:'📞', h:'Réservation & information', d:'☎️ 0669 002 117\n☎️ 0669 002 118\n☎️ 0554 678 921'}
        ] },
      en:{ title:'Azerbaijan – Baku & Gabala 🇦🇿✨', sub:'International · 7 nights · AJet', book:'Azerbaijan – Baku & Gabala',
        text:"🇦🇿 AZERBAIJAN | BAKU & GABALA ✨\n\nAn exceptional tourist program to discover the beauty of Azerbaijan: the charm of the cities, the splendor of nature and the magic of the country.",
        info:["🗓️ 7 nights","🏨 B&B Baku 5 n. + Gabala 2 n.","🚌 Transport & guide","🛂 E-visa included","💰 From 209,000 DZD"],
        program:[
          {t:'📅', h:'Travel date', d:'Sunday 30 August 2026'},
          {t:'✈️', h:'The program includes', d:'Flight ticket on AJet Airlines\nAirport ⇄ hotel transfer\nInter-city travel by comfortable tourist bus\nAccommodation in Baku: 5 nights with breakfast\nAccommodation in Gabala: 2 nights with breakfast\nTour guide + accompaniment and assistance throughout the trip\nExcursions and sightseeing during the stay\nE-visa included 🛂'},
          {t:'💰', h:'Prices', d:'Adult – double room: 209,000 DZD\nAdult – triple room: 205,000 DZD\nAdult – single room: 269,000 DZD\nInfant / child 0–5.99 years: 40,000 DZD\n2nd child 6–11.99 years: 155,000 DZD'},
          {t:'✨', h:'Baku & Gabala', d:'A journey combining the charm of the cities, the beauty of nature and the wonder of Azerbaijan! 🇦🇿'},
          {t:'📞', h:'Reservation & information', d:'☎️ 0669 002 117\n☎️ 0669 002 118\n☎️ 0554 678 921'}
        ] },
      ar:{ title:'أذربيجان – باكو وغابالا 🇦🇿✨', sub:'دولي · 7 ليالٍ · AJet', book:'أذربيجان – باكو وغابالا',
        text:"🇦🇿 أذربيجان | باكو وغابالا ✨\n\nبرنامج سياحي مميز لاكتشاف جمال أذربيجان: سحر المدن، جمال الطبيعة وروعة البلاد.",
        info:["🗓️ 7 ليالٍ","🏨 باكو 5 ل + غابالا 2 ل مع الإفطار","🚌 نقل ومرشد","🛂 التأشيرة الإلكترونية مشمولة","💰 ابتداءً من 209 000 دج"],
        program:[
          {t:'📅', h:'تاريخ السفر', d:'الأحد 30 أوت 2026'},
          {t:'✈️', h:'البرنامج يشمل', d:'تذكرة الطيران على متن AJet Airlines\nنقل المطار ⇄ الفندق\nالتنقل بين المدن بحافلة سياحية مريحة\nالإقامة في باكو: 5 ليالٍ مع وجبة الإفطار\nالإقامة في غابالا: ليلتان مع وجبة الإفطار\nمرشد سياحي + مرافقة ومساعدة طوال الرحلة\nرحلات وجولات سياحية خلال فترة الإقامة\nالتأشيرة الإلكترونية مشمولة 🛂'},
          {t:'💰', h:'الأسعار', d:'بالغ – غرفة مزدوجة: 209 000 دج\nبالغ – غرفة ثلاثية: 205 000 دج\nبالغ – غرفة فردية: 269 000 دج\nرضيع/طفل 0–5.99 سنة: 40 000 دج\nالطفل الثاني 6–11.99 سنة: 155 000 دج'},
          {t:'✨', h:'باكو وغابالا', d:'رحلة تجمع بين سحر المدن، جمال الطبيعة وروعة أذربيجان! 🇦🇿'},
          {t:'📞', h:'الحجز والاستفسار', d:'☎️ 0669 002 117\n☎️ 0669 002 118\n☎️ 0554 678 921'}
        ] }
    },
    'malaysia-2026': {
      img:'promo/pic-malaysia.jpg',
      fr:{ title:'Malaisie – Kuala Lumpur & Langkawi 🇲🇾✨', sub:'International · 10 nuits / 12 jours · Saint Augustin Travel', book:'Malaisie – Kuala Lumpur & Langkawi',
        text:"🇲🇾 MALAISIE 2026 avec SAINT AUGUSTIN TRAVEL 🇲🇾✨\nKuala Lumpur & Langkawi\nEntre modernité asiatique, gratte-ciels, nature féérique et plages tropicales 🌴🏙️\n\nSaint Augustin Travel vous invite à découvrir l’une des plus belles destinations d’Asie, avec un programme mêlant l’ambiance de la capitale malaisienne Kuala Lumpur et la splendeur de l’île de Langkawi, pour un séjour confortable, des visites et un accompagnement organisé tout au long du voyage.",
        info:["🗓️ 10 nuits / 12 jours","✈️ Air Algérie + vols domestiques","🏨 Hôtels 4★ & 5★","🍳 Petit-déjeuner inclus","💼 Organisé & accompagné"],
        program:[
          {t:'📍', h:'Durée du programme', d:'10 nuits en Malaisie\n12 jours de voyage et de découverte\nSéjour entre Kuala Lumpur et Langkawi'},
          {t:'✈️', h:'Informations du vol', d:'🏷️ Aller :\nAH3156\nAlger ALG ➜ Kuala Lumpur KUL\nDépart : 17:55\nArrivée : 13:30\n\n🏷️ Retour :\nAH3157\nKuala Lumpur KUL ➜ Alger ALG\nDépart : 18:30\nArrivée : 02:15'},
          {t:'✅', h:'Le prix comprend', d:'Billet d’avion domestique national Oran – Alger – Oran\nBillet international aller-retour avec Air Algérie\nBillet domestique en Malaisie Kuala Lumpur – Langkawi – Kuala Lumpur\nDépart d’Alger\n10 nuits / 12 jours en hôtels choisis 4★ et 5★\nPetit-déjeuner inclus\nExcursions et visites programmées\nGuide local qualifié\nAide et accompagnement local\nOrganisation et suivi personnalisé des réservations'},
          {t:'🌆', h:'Sites à Kuala Lumpur', d:'🏙️ Kuala Lumpur City Tour – découverte des monuments, quartiers et plus beaux points photo.\n🏢 Petronas Twin Towers – les tours jumelles, symbole de la Malaisie.\n👑 Istana Negara – palais royal, photos souvenirs.\n🕌 Masjid Negara – mosquée nationale à l’architecture moderne.\n🏛️ Monumen Negara – monument national et belle vue.\n🌉 Saloma Link – pont lumineux moderne, idéal le soir.\n🛕 Batu Caves & Temples – grottes de Batu, escaliers colorés et grand temple.\n🕌 Putrajaya & Putra Mosque – ville administrative et mosquée rose.'
          +''},
          {t:'🌴', h:'Programme Langkawi', d:'🚤 Langkawi Island Hopping – sortie en mer entre les îles, plages turquoise, paysages tropicaux, baignade et détente.\n\nLangkawi est la destination idéale pour les amoureux de la mer, du calme, de la photo et des resorts haut de gamme 🌊🌴'},
          {t:'🏨', h:'Hôtels proposés (selon disponibilité)', d:'À Kuala Lumpur :\n⭐ Renaissance Hotel Kuala Lumpur\n⭐ The Face Suite Kuala Lumpur\n⭐ EQ Hotel Kuala Lumpur\n⭐ Royal Signature\n\nÀ Langkawi :\n⭐ Holiday Villa Langkawi\n⭐ Pelangi Beach Resort & Spa Langkawi\n⭐ Hilton Resort Langkawi\n\n📌 Les hôtels sont selon la date de départ et la disponibilité.'},
          {t:'🗓️', h:'Départs & tarifs', d:'🛫 23 Août 2026\n🏨 The Face Suite + Pelangi\nChambre double : 379.000 DA\nChambre triple : 369.000 DA\nChambre single : 499.000 DA\nEnfant sans lit : 249.000 DA\nEnfant avec lit : 369.000 DA\n\n🛫 26 Août 2026\n🏨 The Face Suite + Holiday Villa\nChambre double : 359.000 DA\nChambre triple : 349.000 DA\nChambre single : 499.000 DA\nEnfant sans lit : 239.000 DA\nEnfant avec lit : 345.000 DA'},
          {t:'⚠️', h:'Note importante', d:'La taxe de séjour n’est pas incluse dans le prix et est estimée à 30 € par chambre.'},
          {t:'📞', h:'Réservation & information', d:'Saint Augustin Travel\n☎️ 0554 67 89 21\n☎️ 0669 00 21 18\n☎️ 0669 00 11 17'}
        ] },
      en:{ title:'Malaysia – Kuala Lumpur & Langkawi 🇲🇾✨', sub:'International · 10 nights / 12 days · Saint Augustin Travel', book:'Malaysia – Kuala Lumpur & Langkawi',
        text:"🇲🇾 MALAYSIA 2026 with SAINT AUGUSTIN TRAVEL 🇲🇾✨\nKuala Lumpur & Langkawi\nBetween Asian modernity, skyscrapers, enchanting nature and tropical beaches 🌴🏙️\n\nSaint Augustin Travel invites you to discover one of the most beautiful destinations in Asia, with a program combining the atmosphere of the Malaysian capital Kuala Lumpur and the wonder of the island of Langkawi, for a comfortable stay, sightseeing and organized accompaniment throughout the journey.",
        info:["🗓️ 10 nights / 12 days","✈️ Air Algérie + domestic flights","🏨 4★ & 5★ hotels","🍳 Breakfast included","💼 Organized & accompanied"],
        program:[
          {t:'📍', h:'Program duration', d:'10 nights in Malaysia\n12 days of travel and discovery\nStay between Kuala Lumpur and Langkawi'},
          {t:'✈️', h:'Flight information', d:'🏷️ Outbound :\nAH3156\nAlger ALG ➜ Kuala Lumpur KUL\nDeparture : 17:55\nArrival : 13:30\n\n🏷️ Return :\nAH3157\nKuala Lumpur KUL ➜ Alger ALG\nDeparture : 18:30\nArrival : 02:15'},
          {t:'✅', h:'The price includes', d:'National domestic flight Oran – Alger – Oran\nInternational round-trip ticket with Air Algérie\nDomestic flight in Malaysia Kuala Lumpur – Langkawi – Kuala Lumpur\nDeparture from Algiers\n10 nights / 12 days in selected 4★ and 5★ hotels\nBreakfast included\nProgrammed excursions and sightseeing\nQualified local guide\nLocal help and accompaniment\nPersonalized organization and follow-up of reservations'},
          {t:'🌆', h:'Sites in Kuala Lumpur', d:'🏙️ Kuala Lumpur City Tour – discover the monuments, districts and most beautiful photo spots.\n🏢 Petronas Twin Towers – the iconic twin towers, symbol of Malaysia.\n👑 Istana Negara – royal palace, souvenir photos.\n🕌 Masjid Negara – national mosque with modern architecture.\n🏛️ Monumen Negara – national monument with a beautiful view.\n🌉 Saloma Link – modern luminous bridge, ideal at night.\n🛕 Batu Caves & Temples – Batu caves, colorful stairs and great temple.\n🕌 Putrajaya & Putra Mosque – administrative city and famous pink mosque.'
          +''},
          {t:'🌴', h:'Langkawi program', d:'🚤 Langkawi Island Hopping – sea trip between the islands, turquoise beaches, tropical landscapes, swimming and relaxation.\n\nLangkawi is the ideal destination for lovers of the sea, calm, photography and upscale resorts 🌊🌴'},
          {t:'🏨', h:'Proposed hotels (depending on availability)', d:'In Kuala Lumpur :\n⭐ Renaissance Hotel Kuala Lumpur\n⭐ The Face Suite Kuala Lumpur\n⭐ EQ Hotel Kuala Lumpur\n⭐ Royal Signature\n\nIn Langkawi :\n⭐ Holiday Villa Langkawi\n⭐ Pelangi Beach Resort & Spa Langkawi\n⭐ Hilton Resort Langkawi\n\n📌 Hotels are subject to departure date and availability.'},
          {t:'🗓️', h:'Departures & prices', d:'🛫 23 Août 2026\n🏨 The Face Suite + Pelangi\nDouble room: 379.000 DA\nTriple room: 369.000 DA\nSingle room: 499.000 DA\nChild no bed: 249.000 DA\nChild with bed: 369.000 DA\n\n🛫 26 Août 2026\n🏨 The Face Suite + Holiday Villa\nDouble room: 359.000 DA\nTriple room: 349.000 DA\nSingle room: 499.000 DA\nChild no bed: 239.000 DA\nChild with bed: 345.000 DA'},
          {t:'⚠️', h:'Important note', d:'The city/lodging tax is not included in the price and is estimated at 30 € per room.'},
          {t:'📞', h:'Reservation & information', d:'Saint Augustin Travel\n☎️ 0554 67 89 21\n☎️ 0669 00 21 18\n☎️ 0669 00 11 17'}
        ] },
      ar:{ title:'ماليزيا – كوالالمبور ولانكاوي 🇲🇾✨', sub:'دولي · 10 ليالٍ / 12 يومًا · سانت أوغسطين للسفر', book:'ماليزيا – كوالالمبور ولانكاوي',
        text:"🇲🇾 رحلة ماليزيا 2026 مع SAINT AUGUSTIN TRAVEL ✨🇲🇾\nكوالالمبور ولانكاوي\nبين الحداثة الآسيوية وناطحات السحاب والطبيعة الساحرة والشواطئ الاستوائية 🌴🏙️\n\nتدعوكم سانت أوغسطين للسفر لاكتشاف واحدة من أجمل الوجهات السياحية في آسيا، في برنامج مميز يجمع بين أجواء العاصمة الماليزية كوالالمبور وروعة جزيرة لانكاوي، مع إقامة مريحة وجولات سياحية ومرافقة منظمة طيلة الرحلة.",
        info:["🗓️ 10 ليالٍ / 12 يومًا","✈️ الخطوط الجوية الجزائرية + طيران داخلي","🏨 فنادق 4★ و5★","🍳 فطور مشمول","💼 منظم ومرافق"],
        program:[
          {t:'📍', h:'مدة البرنامج', d:'10 ليالٍ في ماليزيا\n12 يومًا سفرًا واكتشافًا\nإقامة بين كوالالمبور ولانكاوي'},
          {t:'✈️', h:'معلومات الرحلة الجوية', d:'🏷️ الذهاب :\nAH3156\nAlger ALG ➜ Kuala Lumpur KUL\nالانطلاق : 17:55\nالوصول : 13:30\n\n🏷️ العودة :\nAH3157\nKuala Lumpur KUL ➜ Alger ALG\nالانطلاق : 18:30\nالوصول : 02:15'},
          {t:'✅', h:'السعر يشمل', d:'تذكرة الطيران الداخلي الوطني Oran – Alger – Oran\nتذكرة الطيران الدولي ذهابًا وإيابًا مع Air Algérie\nتذكرة الطيران الداخلي في ماليزيا Kuala Lumpur – Langkawi – Kuala Lumpur\nالانطلاق من الجزائر العاصمة\nإقامة 10 ليالٍ / 12 يومًا في فنادق مختارة 4★ و5★\nفطور الصباح مشمول\nخرجات سياحية وجولات مبرمجة\nدليل محلي مؤهل\nمساعدة ومرافقة محلية\nتنظيم ومتابعة شخصية للحجوزات'},
          {t:'🌆', h:'أهم الأماكن في Kuala Lumpur', d:'🏙️ Kuala Lumpur City Tour – جولة لاكتشاف أهم معالم العاصمة وأجمل نقاط التصوير.\n🏢 Petronas Twin Towers – زيارة الأبراج التوأم الشهيرة، رمز ماليزيا.\n👑 Istana Negara – القصر الملكي، صور تذكارية.\n🕌 Masjid Negara – المسجد الوطني بهندسته الحديثة.\n🏛️ Monumen Negara – النصب التذكاري الوطني بإطلالة جميلة.\n🌉 Saloma Link – جسر عصري مضيء، ممتاز في المساء.\n🛕 Batu Caves & Temples – كهوف باتو والسلالم الملونة والمعابد.\n🕌 Putrajaya & Putra Mosque – المدينة الإدارية والمسجد الوردي الشهير.'},
          {t:'🌴', h:'برنامج Langkawi', d:'🚤 Langkawi Island Hopping – خرجة بحرية بين الجزر، شواطئ فيروزية، مناظر استوائية، سباحة واسترخاء.\n\nلانكاوي هي الوجهة المثالية لمحبي البحر والهدوء والتصوير والمنتجعات الراقية 🌊🌴'},
          {t:'🏨', h:'الفنادق المقترحة حسب التوفر', d:'في Kuala Lumpur :\n⭐ Renaissance Hotel Kuala Lumpur\n⭐ The Face Suite Kuala Lumpur\n⭐ EQ Hotel Kuala Lumpur\n⭐ Royal Signature\n\nفي Langkawi :\n⭐ Holiday Villa Langkawi\n⭐ Pelangi Beach Resort & Spa Langkawi\n⭐ Hilton Resort Langkawi\n\n📌 الفنادق حسب تاريخ الانطلاق والتوفر وقت الحجز.'},
          {t:'🗓️', h:'تواريخ الانطلاق والأسعار', d:'🛫 23 Août 2026\n🏨 The Face Suite + Pelangi\nغرفة مزدوجة: 379.000 دج\nغرفة ثلاثية: 369.000 دج\nغرفة فردية: 499.000 دج\nطفل بدون سرير: 249.000 دج\nطفل مع سرير: 369.000 دج\n\n🛫 26 Août 2026\n🏨 The Face Suite + Holiday Villa\nغرفة مزدوجة: 359.000 دج\nغرفة ثلاثية: 349.000 دج\nغرفة فردية: 499.000 دج\nطفل بدون سرير: 239.000 دج\nطفل مع سرير: 345.000 دج'},
          {t:'⚠️', h:'ملاحظة مهمة', d:'ضريبة الإقامة غير مشمولة في السعر وتُقدَّر بـ 30 € للغرفة.'},
          {t:'📞', h:'الحجز والاستفسار', d:'Saint Augustin Travel\n☎️ 0554 67 89 21\n☎️ 0669 00 21 18\n☎️ 0669 00 11 17'}
        ] }
    },
    'imperial-tour': {
      img:'hero-afternoon.png',
      fr:{ title:'Impérial Tour', sub:'International · 7 jours · Maroc', book:'Impérial Tour',
        text:"Les quatre villes impériales du Maroc — Rabat, Fès, Meknès et Marrakech — racontent plus de mille ans d'histoire. Fès, l'une des plus anciennes villes médiévales, garde sa médina vivante ; Meknès fut la capitale de Moulay Ismaïl ; Marrakech est la ville ocre aux jardins et souks légendaires ; Rabat, la capitale, abrite la tour Hassan." },
      en:{ title:'Imperial Tour', sub:'International · 7 days · Morocco', book:'Imperial Tour',
        text:"Morocco's four imperial cities — Rabat, Fes, Meknes and Marrakesh — tell over a thousand years of history. Fes, one of the oldest medieval cities, keeps its living medina; Meknes was the capital of Moulay Ismail; Marrakesh is the ochre city of legendary gardens and souks; Rabat, the capital, is home to the Hassan Tower." },
      ar:{ title:'الجولة الإمبراطورية', sub:'دولي · 7 أيام · المغرب', book:'الجولة الإمبراطورية',
        text:"المدن الإمبراطورية الأربع في المغرب — الرباط وفاس ومكناس ومراكش — تحكي أكثر من ألف سنة من التاريخ. تحافظ فاس، إحدى أقدم المدن الوسيطية، على مدينتها العتيقة الحية؛ وكانت مكناس عاصمة مولاي إسماعيل؛ ومراكش المدينة الحمراء بحدائقها وأسواقها الأسطورية؛ وتضم الرباط، العاصمة، صومعة حسان." }
    },
    'nil-croisiere': {
      img:'hero-night.png',
      fr:{ title:'Le Nil en Croisière', sub:'International · 8 jours · Égypte', book:'Le Nil en Croisière',
        text:"Le long du Nil, l'Égypte déroule cinq millénaires d'histoire. Au Caire, les pyramides de Gizeh et le sphinx dominent le plateau ; à Louxor, temple de Karnak et vallée des Rois ; à Assouan, temples de Philæ et les barrages. Une croisière entre l'Égypte des pharaons, la Nubie et les rives du fleuve le plus mythique du monde." },
      en:{ title:'Nile Cruise', sub:'International · 8 days · Egypt', book:'Nile Cruise',
        text:"Along the Nile, Egypt unfolds five millennia of history. In Cairo, the pyramids of Giza and the Sphinx dominate the plateau; at Luxor, the Karnak temple and the Valley of the Kings; at Aswan, the temples of Philae and the dams. A cruise between pharaonic Egypt, Nubia and the banks of the world's most mythical river." },
      ar:{ title:'رحلة النيل', sub:'دولي · 8 أيام · مصر', book:'رحلة النيل',
        text:"على ضفاف النيل، تكشف مصر خمسة آلاف سنة من التاريخ. في القاهرة، تطل أهرامات الجيزة وأبو الهول على الهضبة؛ وفي الأقصر معبد الكرنك ووادي الملوك؛ وفي أسوان معبدا فيلة والسدود. رحلة بحرية بين مصر الفراعنة والنوبة وضفاف أكثر أنهار العالم أسطورية." }
    },

    /* ------- Excursions Intérieur ------- */
    'annaba-hippone': {
      img:'promo/pic-annaba.jpg',
      fr:{ title:'Annaba & Hippone Regius', sub:'Excursion · 1 jour · Petit groupe', book:'Annaba & Hippone Regius',
        text:"Annaba, l'antique Hippone Regius, fut une cité prospère de la Numidie puis de l'Afrique romaine. On y admire les ruines imposantes d'Hippone, la Basilique et le musée Saint-Augustin, consacrés à l'évêque d'Hippone. Son front de mer et le cours Bertagna mêlent héritage et urbanisme moderne, au cœur du littoral est algérien.",
        info:["🗓️ 1 jour","⏰ 09:00 - 15:00","🚐 Transport inclus","📖 Guide inclus"],
        program:[
          {t:'09:00', h:'Départ', d:'Prise en charge à partir de votre hébergement.'},
          {t:'09:30', h:'Site archéologique d\'Hippone Royale', d:'Visite du site archéologique d\'Hippone Royale.'},
          {t:'11:00', h:'Basilique Saint-Augustin', d:'Visite de la Basilique Saint-Augustin.'},
          {t:'12:00', h:'Vieille ville & Cours de la Révolution', d:'Découverte de la vieille ville et dégustation de glaces au Cours de la Révolution.'},
          {t:'13:00', h:'Déjeuner', d:'Déjeuner pendant les visites, puis retour à l\'hôtel.'},
          {t:'15:00', h:'Retour', d:'Retour à l\'hôtel, fin de la prestation.'}
        ] },
      en:{ title:'Annaba & Hippo Regius', sub:'Excursion · 1 day · Small group', book:'Annaba & Hippo Regius',
        text:"Annaba, the ancient Hippo Regius, was a prosperous city of Numidia and then of Roman Africa. Here you can admire the imposing ruins of Hippo, the Basilica and the Saint Augustine museum, dedicated to the bishop of Hippo. Its seafront and the Bertagna promenade blend heritage and modern town planning, in the heart of the eastern Algerian coast.",
        info:["🗓️ 1 day","⏰ 9:00 AM - 3:00 PM","🚐 Transport included","📖 Guide included"],
        program:[
          {t:'09:00', h:'Departure', d:'Pick-up from your accommodation.'},
          {t:'09:30', h:'Hippo Regius archaeological site', d:'Visit to the archaeological site of Hippo Regius.'},
          {t:'11:00', h:'Saint Augustine Basilica', d:'Visit to the Basilica of Saint Augustine.'},
          {t:'12:00', h:'Old town & Cours de la Révolution', d:'Discover the old town and enjoy ice cream tasting at Cours de la Révolution.'},
          {t:'13:00', h:'Lunch', d:'Lunch during the tour, then return to the hotel.'},
          {t:'15:00', h:'Return', d:'Return to the hotel, end of service.'}
        ] },
      ar:{ title:'عنابة وهيبون ريجيوس', sub:'رحلة · يوم واحد · مجموعة صغيرة', book:'عنابة وهيبون ريجيوس',
        text:"كانت عنابة، هيبون ريجيوس القديمة، مدينة مزدهرة في نوميديا ثم في أفريقيا الرومانية. يقف الزائر أمام الآثار المهيبة لهيبون والبازيليك ومتحف القديس أوغسطين المكرس لأسقف هيبون. يمزج واجهتها البحرية وساحة بيرتاغنا بين الإرث والعمران الحديث في قلب الساحل الشرقي للجزائر.",
        info:["🗓️ يوم واحد","⏰ 09:00 - 15:00","🚐 نقل مشمول","📖 مرشد مشمول"],
        program:[
          {t:'09:00', h:'الانطلاق', d:'الاستقبال من مكان إقامتكم.'},
          {t:'09:30', h:'الموقع الأثري لهيبون ريجيوس', d:'زيارة الموقع الأثري لهيبون ريجيوس.'},
          {t:'11:00', h:'بازيليك سانت أوغسطين', d:'زيارة بازيليك سانت أوغسطين.'},
          {t:'12:00', h:'المدينة العتيقة وساحة الثورة', d:'اكتشاف المدينة العتيقة وتذوق المثلجات في ساحة الثورة.'},
          {t:'13:00', h:'الغداء', d:'الغداء أثناء الزيارات ثم العودة إلى الفندق.'},
          {t:'15:00', h:'العودة', d:'العودة إلى الفندق ونهاية الخدمة.'}
        ] }
    },
'guelma': {
      img:'promo/pic-guelma.jpg',
      fr:{ title:'Guelma', sub:'Excursion · 1 jour', book:'Guelma',
        text:"Guelma, l'antique Calama, conserve un riche patrimoine numide et romain. Le théâtre romain, en cours de restauration, est l'un des plus grands d'Afrique du Nord. Les sources thermales de Hammam Debagh et la vieille ville, entre héritage byzantin et ottoman, composent un site charmant au cœur de l'Est algérien.",
        info:["🗓️ 1 jour","⏰ 09:00 - 15:00","🚐 Transport inclus","📖 Guide inclus"],
        program:[
          {t:'09:00', h:'Départ', d:'Prise en charge à partir de votre hébergement.'},
          {t:'09:30', h:'Théâtre antique', d:'Visite du théâtre antique entièrement restauré.'},
          {t:'11:00', h:'Caserne Square & thermes romains', d:'Visite de l\'enceinte de l\'ex caserne Square (musée à ciel ouvert) et visite des thermes romains.'},
          {t:'12:00', h:'Jardin archéologique & Thibilis', d:'Visite du jardin archéologique et du site antique de Thibilis.'},
          {t:'13:00', h:'Hammam Meskhoutine', d:'Visite des sources chaudes de Hammam Meskhoutine et de la cascade, avec possibilité de prendre un bain thermal.'},
          {t:'15:00', h:'Retour', d:'Retour à l\'hôtel, fin de la prestation.'}
        ] },
      en:{ title:'Guelma', sub:'Excursion · 1 day', book:'Guelma',
        text:"Guelma, the ancient Calama, preserves a rich Numidian and Roman heritage. The Roman theatre, under restoration, is one of the largest in North Africa. The hot springs of Hammam Debagh and the old town, a blend of Byzantine and Ottoman heritage, form a charming site in the heart of eastern Algeria.",
        info:["🗓️ 1 day","⏰ 9:00 AM - 3:00 PM","🚐 Transport included","📖 Guide included"],
        program:[
          {t:'09:00', h:'Departure', d:'Pick-up from your accommodation.'},
          {t:'09:30', h:'Ancient theatre', d:'Visit the fully restored ancient theatre.'},
          {t:'11:00', h:'Square barracks & Roman baths', d:'Visit the former Square barracks enclosure (open-air museum) and the Roman baths.'},
          {t:'12:00', h:'Archaeological garden & Thibilis', d:'Visit the archaeological garden and the ancient site of Thibilis.'},
          {t:'13:00', h:'Hammam Meskhoutine', d:'Visit the hot springs of Hammam Meskhoutine and the waterfall, with the possibility of a thermal bath.'},
          {t:'15:00', h:'Return', d:'Return to the hotel, end of service.'}
        ] },
      ar:{ title:'قالمة', sub:'رحلة · يوم واحد', book:'قالمة',
        text:"تحافظ قالمة، كالاما القديمة، على إرث غني نوميدي وروماني. المسرح الروماني، الذي يخضع للترميم، من أكبرها في شمال أفريقيا. تشكّل ينابيع حمام دباغ الحارة والمدينة القديمة، بين الإرث البيزنطي والعثماني، موقعاً ساحراً في قلب شرق الجزائر.",
        info:["🗓️ يوم واحد","⏰ 09:00 - 15:00","🚐 نقل مشمول","📖 مرشد مشمول"],
        program:[
          {t:'09:00', h:'الانطلاق', d:'الاستقبال من مكان إقامتكم.'},
          {t:'09:30', h:'المسرح القديم', d:'زيارة المسرح القديم المرمم بالكامل.'},
          {t:'11:00', h:'ثكنة سكوير والحمامات الرومانية', d:'زيارة سور ثكنة سكوير السابقة (متحف في الهواء الطلق) وزيارة الحمامات الرومانية.'},
          {t:'12:00', h:'الحديقة الأثرية وثيبيلس', d:'زيارة الحديقة الأثرية والموقع القديم لثيبيلس.'},
          {t:'13:00', h:'حمام مسخوطين', d:'زيارة الينابيع الحارة لحمام مسخوطين والشلال مع إمكانية الاستحمام الحراري.'},
          {t:'15:00', h:'العودة', d:'العودة إلى الفندق ونهاية الخدمة.'}
        ] }
    },
'mila': {
      img:'promo/pic-mila.jpg',
      fr:{ title:'Mila', sub:'Excursion · 1 jour', book:'Mila',
        text:"Mila, l'ancienne Milev, est bâtie sur un promontoire rocheux au-dessus de la rivière Rhummel. Sa vieille ville abrite des vestiges byzantins, dont les remparts de la citadelle, et un patrimoine de mosquées et de maisons anciennes. Les ponts et les gorges offrent de superbes panoramas sur cette ville unique.",
        info:["🗓️ 1 jour","⏰ 09:00 - 15:00","🚐 Transport inclus","📖 Guide inclus"],
        program:[
          {t:'09:00', h:'Départ', d:'Prise en charge à partir de votre hébergement.'},
          {t:'09:30', h:'Hôtel Tapis Rouge', d:'Séjour à l\'Hôtel Tapis Rouge.'},
          {t:'11:00', h:'Sites historiques de Mila', d:'Visite des principaux sites historiques de Mila.'},
          {t:'12:00', h:'Bains naturels', d:'Profiter des bains naturels.'},
          {t:'13:00', h:'Shopping à Constantine', d:'Shopping à Constantine.'},
          {t:'15:00', h:'Retour', d:'Retour à l\'hôtel, fin de la prestation.'}
        ] },
      en:{ title:'Mila', sub:'Excursion · 1 day', book:'Mila',
        text:"Mila, the ancient Milev, is built on a rocky promontory above the Rhummel river. Its old town holds Byzantine remains, including the citadel walls, and a heritage of mosques and old houses. The bridges and gorges offer superb views over this unique city.",
        info:["🗓️ 1 day","⏰ 9:00 AM - 3:00 PM","🚐 Transport included","📖 Guide included"],
        program:[
          {t:'09:00', h:'Departure', d:'Pick-up from your accommodation.'},
          {t:'09:30', h:'Tapis Rouge Hotel', d:'Stay at Tapis Rouge Hotel.'},
          {t:'11:00', h:'Mila historical landmarks', d:'Visit the main historical landmarks of Mila.'},
          {t:'12:00', h:'Natural baths', d:'Enjoy the natural baths.'},
          {t:'13:00', h:'Shopping in Constantine', d:'Shopping in Constantine.'},
          {t:'15:00', h:'Return', d:'Return to the hotel, end of service.'}
        ] },
      ar:{ title:'ميلة', sub:'رحلة · يوم واحد', book:'ميلة',
        text:"ميلة، ميليف القديمة، مبنية على نتوء صخري فوق وادي الرمال. تضم مدينتها القديمة آثاراً بيزنطية، منها أسوار القلعة، وإرثاً من المساجد والبيوت العتيقة. توفر الجسور والأخاديد إطلالات رائعة على هذه المدينة الفريدة.",
        info:["🗓️ يوم واحد","⏰ 09:00 - 15:00","🚐 نقل مشمول","📖 مرشد مشمول"],
        program:[
          {t:'09:00', h:'الانطلاق', d:'الاستقبال من مكان إقامتكم.'},
          {t:'09:30', h:'فندق تابيس روج', d:'الإقامة في فندق تابيس روج.'},
          {t:'11:00', h:'المواقع التاريخية لميلة', d:'زيارة أهم المواقع التاريخية لميلة.'},
          {t:'12:00', h:'الحمامات الطبيعية', d:'الاستمتاع بالحمامات الطبيعية.'},
          {t:'13:00', h:'تسوق في قسنطينة', d:'تسوق في قسنطينة.'},
          {t:'15:00', h:'العودة', d:'العودة إلى الفندق ونهاية الخدمة.'}
        ] }
    },
'souk-ahras': {
      img:'promo/pic-souk-ahras.jpg',
      fr:{ title:'Souk Ahras', sub:'Excursion · 1 jour', book:'Souk Ahras',
        text:"Souk Ahras, l'antique Thagaste, est la ville natale de saint Augustin, né en 354. Entourée de montagnes et de forêts de figuiers, la région conserve la mémoire du grand penseur chrétien et un riche terroir. Un circuit spirituel et naturel inoubliable à l'extrême Est de l'Algérie.",
        info:["🗓️ 1 jour","⏰ 09:00 - 15:00","🚐 Transport inclus","📖 Guide inclus"],
        program:[
          {t:'09:00', h:'Départ', d:'Prise en charge à partir de votre hébergement.'},
          {t:'09:30', h:'Site archéologique de Khemissa', d:'Visite du site archéologique de Khemissa et du théâtre romain.'},
          {t:'11:00', h:'Fort byzantin & Grande Porte', d:'Visite du fort byzantin et de la Grande Porte.'},
          {t:'12:00', h:'El Bordj & Olivier de Saint-Augustin', d:'Visite d\'El Bordj et de l\'Olivier de Saint-Augustin.'},
          {t:'13:00', h:'Déjeuner', d:'Déjeuner puis retour à l\'hôtel.'},
          {t:'15:00', h:'Retour', d:'Retour à l\'hôtel, fin de la prestation.'}
        ] },
      en:{ title:'Souk Ahras', sub:'Excursion · 1 day', book:'Souk Ahras',
        text:"Souk Ahras, the ancient Thagaste, is the birthplace of Saint Augustine, born in 354. Surrounded by mountains and fig-tree forests, the region preserves the memory of the great Christian thinker and a rich land. An unforgettable spiritual and natural tour at the far east of Algeria.",
        info:["🗓️ 1 day","⏰ 9:00 AM - 3:00 PM","🚐 Transport included","📖 Guide included"],
        program:[
          {t:'09:00', h:'Departure', d:'Pick-up from your accommodation.'},
          {t:'09:30', h:'Khemissa archaeological site', d:'Visit to the Khemissa archaeological site and Roman theatre.'},
          {t:'11:00', h:'Byzantine fort & Great Gate', d:'Visit to the Byzantine fort and the Great Gate.'},
          {t:'12:00', h:'El Bordj & Saint Augustine\'s Olive Tree', d:'Visit to El Bordj and Saint Augustine\'s Olive Tree.'},
          {t:'13:00', h:'Lunch', d:'Lunch then return to the hotel.'},
          {t:'15:00', h:'Return', d:'Return to the hotel, end of service.'}
        ] },
      ar:{ title:'سوق أهراس', sub:'رحلة · يوم واحد', book:'سوق أهراس',
        text:"سوق أهراس، تاغاست القديمة، هي مسقط رأس سانت أوغسطين، المولود سنة 354. تحافظ المنطقة، المحاطة بالجبال وغابات التين، على ذكرى المفكر المسيحي الكبير وعلى إرث طبيعي غني. جولة روحية وطبيعية لا تُنسى في أقصى شرق الجزائر.",
        info:["🗓️ يوم واحد","⏰ 09:00 - 15:00","🚐 نقل مشمول","📖 مرشد مشمول"],
        program:[
          {t:'09:00', h:'الانطلاق', d:'الاستقبال من مكان إقامتكم.'},
          {t:'09:30', h:'الموقع الأثري لخميسة', d:'زيارة الموقع الأثري لخميسة والمسرح الروماني.'},
          {t:'11:00', h:'الحصن البيزنطي والبوابة الكبرى', d:'زيارة الحصن البيزنطي والبوابة الكبرى.'},
          {t:'12:00', h:'البرج وشجرة سانت أوغسطين', d:'زيارة البرج وشجرة سانت أوغسطين.'},
          {t:'13:00', h:'الغداء', d:'الغداء ثم العودة إلى الفندق.'},
          {t:'15:00', h:'العودة', d:'العودة إلى الفندق ونهاية الخدمة.'}
        ] }
    },
'skikda': {
      img:'promo/pic-skikda.jpg',
      fr:{ title:'Skikda', sub:'Excursion · 1 jour', book:'Skikda',
        text:"Skikda, l'antique Rusicade, compte parmi les plus beaux littoraux du Maghreb. Fondée par les Phéniciens, puis port de la puissance romaine, elle offre ruines antiques face à la mer, corniches sauvages et baies où se mêlent histoire méditerranéenne et douceur de vivre.",
        info:["🗓️ 1 jour","⏰ 09:00 - 15:00","🚐 Transport inclus","📖 Guide inclus"],
        program:[
          {t:'09:00', h:'Départ', d:'Prise en charge à partir de votre hébergement.'},
          {t:'09:30', h:'Vieille ville de Skikda', d:'Visite de la vieille ville de Skikda.'},
          {t:'11:00', h:'Théâtre romain', d:'Visite du théâtre romain et de l\'hôtel de la vieille ville.'},
          {t:'12:00', h:'Gare ferroviaire', d:'Visite de la gare ferroviaire et de son architecture néo-mauresque.'},
          {t:'13:00', h:'Déjeuner', d:'Déjeuner sur place, puis retour à l\'hôtel.'},
          {t:'15:00', h:'Retour', d:'Retour à l\'hôtel, fin de la prestation.'}
        ] },
      en:{ title:'Skikda', sub:'Excursion · 1 day', book:'Skikda',
        text:"Skikda, the ancient Rusicade, ranks among the most beautiful coastlines of the Maghreb. Founded by the Phoenicians, then a port of Roman power, it offers ancient ruins facing the sea, wild corniches and bays blending Mediterranean history and the dolce vita.",
        info:["🗓️ 1 day","⏰ 9:00 AM - 3:00 PM","🚐 Transport included","📖 Guide included"],
        program:[
          {t:'09:00', h:'Departure', d:'Pick-up from your accommodation.'},
          {t:'09:30', h:'Old town of Skikda', d:'Visit to the old town of Skikda.'},
          {t:'11:00', h:'Roman theatre', d:'Visit to the Roman theatre and the old-town hotel.'},
          {t:'12:00', h:'Railway station', d:'Visit to the railway station and its neo-Moorish architecture.'},
          {t:'13:00', h:'Lunch', d:'Lunch on site, then return to the hotel.'},
          {t:'15:00', h:'Return', d:'Return to the hotel, end of service.'}
        ] },
      ar:{ title:'سكيكدة', sub:'رحلة · يوم واحد', book:'سكيكدة',
        text:"سكيكدة، روسيكاد القديمة، من أجمل السواحل في المغرب العربي. أسسها الفينيقيون ثم أصبحت ميناءً رومانياً، وتعرض آثاراً قديمة تطل على البحر ومنحدرات برية وخلجاناً تمزج التاريخ المتوسطي بجمال العيش.",
        info:["🗓️ يوم واحد","⏰ 09:00 - 15:00","🚐 نقل مشمول","📖 مرشد مشمول"],
        program:[
          {t:'09:00', h:'الانطلاق', d:'الاستقبال من مكان إقامتكم.'},
          {t:'09:30', h:'المدينة العتيقة لسكيكدة', d:'زيارة المدينة العتيقة لسكيكدة.'},
          {t:'11:00', h:'المسرح الروماني', d:'زيارة المسرح الروماني وفندق المدينة العتيقة.'},
          {t:'12:00', h:'محطة السكة الحديدية', d:'زيارة محطة السكة الحديدية وهندستها المعمارية النيو-مورية.'},
          {t:'13:00', h:'الغداء', d:'الغداء في المكان ثم العودة إلى الفندق.'},
          {t:'15:00', h:'العودة', d:'العودة إلى الفندق ونهاية الخدمة.'}
        ] }
    },
    'el-kala': {
      img:'promo/pic-el-kala.jpg',
      fr:{ title:'El Kala', sub:'Excursion · 1 jour', book:'El Kala',
        text:"Le parc national d'El Kala, classé réserve de biosphère par l'UNESCO, protège lagunes, forêts et zones humides parmi les plus riches de Méditerranée. Entre le lac Tonga, refuge de milliers d'oiseaux, et les plages de sable doré, c'est un écrin de nature préservée à l'extrême Est algérien.",
        info:["🗓️ 1 jour","⏰ 09:00 - 15:00","🚐 Transport inclus","📖 Guide inclus"],
        program:[
          {t:'09:00', h:'Départ', d:'Prise en charge à partir de votre hébergement.'},
          {t:'09:30', h:'Parc national d\'El Kala', d:'Visite du Parc national d\'El Kala.'},
          {t:'11:00', h:'Phare de Cap Rosa', d:'Visite du phare de Cap Rosa.'},
          {t:'12:00', h:'Lac des Oiseaux & Lac Tonga', d:'Visite du Lac des Oiseaux et du Lac Tonga.'},
          {t:'13:00', h:'Déjeuner', d:'Déjeuner pendant l\'excursion, puis retour à l\'hôtel.'},
          {t:'15:00', h:'Retour', d:'Retour à l\'hôtel, fin de la prestation.'}
        ] },
      en:{ title:'El Kala', sub:'Excursion · 1 day', book:'El Kala',
        text:"The El Kala national park, a UNESCO biosphere reserve, protects some of the Mediterranean's richest lagoons, forests and wetlands. Between Lake Tonga, a refuge for thousands of birds, and its golden sandy beaches, it is a haven of unspoiled nature at Algeria's far east.",
        info:["🗓️ 1 day","⏰ 9:00 AM - 3:00 PM","🚐 Transport included","📖 Guide included"],
        program:[
          {t:'09:00', h:'Departure', d:'Pick-up from your accommodation.'},
          {t:'09:30', h:'El Kala National Park', d:'Visit to El Kala National Park.'},
          {t:'11:00', h:'Cap Rosa lighthouse', d:'Visit to Cap Rosa lighthouse.'},
          {t:'12:00', h:'Lake of Birds & Lake Tonga', d:'Visit to Lake of Birds and Lake Tonga.'},
          {t:'13:00', h:'Lunch', d:'Lunch during the tour, then return to the hotel.'},
          {t:'15:00', h:'Return', d:'Return to the hotel, end of service.'}
        ] },
      ar:{ title:'القالة', sub:'رحلة · يوم واحد', book:'القالة',
        text:"متنزه القالة الوطني، المصنف محمية بيوسفيرية من طرف اليونسكو، يحمي بحيرات وغابات وأراضي رطبة من أغنى ما في المتوسط. بين بحيرة التونغا، ملاذ آلاف الطيور، وشواطئها الرملية الذهبية، هو جوهرة طبيعة محفوظة في أقصى شرق الجزائر.",
        info:["🗓️ يوم واحد","⏰ 09:00 - 15:00","🚐 نقل مشمول","📖 مرشد مشمول"],
        program:[
          {t:'09:00', h:'الانطلاق', d:'الاستقبال من مكان إقامتكم.'},
          {t:'09:30', h:'متنزه القالة الوطني', d:'زيارة متنزه القالة الوطني.'},
          {t:'11:00', h:'منارة رأس روزا', d:'زيارة منارة رأس روزا.'},
          {t:'12:00', h:'بحيرة الطيور وبحيرة تونغا', d:'زيارة بحيرة الطيور وبحيرة تونغا.'},
          {t:'13:00', h:'الغداء', d:'الغداء أثناء الرحلة ثم العودة إلى الفندق.'},
          {t:'15:00', h:'العودة', d:'العودة إلى الفندق ونهاية الخدمة.'}
        ] }
    },
    'constantine': {
      img:'promo/pic-constantine.jpg',
      fr:{ title:'Constantine, la Ville des Ponts', sub:'Excursion · 1 jour', book:'Constantine, la Ville des Ponts',
        text:"Constantine est suspendue entre les gorges vertigineuses du Rhummel. Capitale des Numides, elle fut l'une des cités les plus peuplées d'Afrique romaine, puis un grand centre ottoman. Ses huit ponts, dont le fameux pont suspendu Sidi M'Cid, relient le rocher de la vieille ville à la métropole moderne." },
      en:{ title:'Constantine, the City of Bridges', sub:'Excursion · 1 day', book:'Constantine, the City of Bridges',
        text:"Constantine hangs between the vertiginous gorges of the Rhummel. Capital of the Numidians, it was one of the most populated cities of Roman Africa, then a great Ottoman centre. Its eight bridges, including the famous Sidi M'Cid suspension bridge, link the old city's rock to the modern metropolis." },
      ar:{ title:'قسنطينة مدينة الجسور', sub:'رحلة · يوم واحد', book:'قسنطينة مدينة الجسور',
        text:"تتعلق قسنطينة بين أخاديد الرمال الهابطة. عاصمة النوميديين، كانت من أكثر مدن أفريقيا الرومانية سكاناً، ثم مركزاً عثمانياً عظيماً. تربط جسورها الثمانية، ومنها جسر سيدي مسيد المعلق الشهير، صخرة المدينة العتيقة بالمدينة الحديثة." }
    },
    'tipaza': {
      img:'promo/pic-tipaza.jpg',
      fr:{ title:'Tipaza & ses Sites Antiques', sub:'Excursion · 1 jour', book:'Tipaza et ses Sites Antiques',
        text:"Au bord de la Méditerranée, Tipaza conserve un vaste site antique classé à l'UNESCO : théâtre, basiliques, amphithéâtre et nécropoles hérités des Phéniciens, des Romains puis des premiers chrétiens. Face aux ruines, la mer et la petite ville moderne offrent l'un des plus beaux panoramas de la côte algérienne." },
      en:{ title:'Tipaza & its Ancient Sites', sub:'Excursion · 1 day', book:'Tipaza and its Ancient Sites',
        text:"By the Mediterranean, Tipaza preserves a vast UNESCO-listed ancient site: theatre, basilicas, amphitheatre and necropolises inherited from the Phoenicians, the Romans and then the first Christians. Facing the ruins, the sea and the small modern town offer one of the most beautiful panoramas of the Algerian coast." },
      ar:{ title:'تيبازة وآثارها القديمة', sub:'رحلة · يوم واحد', book:'تيبازة وآثارها القديمة',
        text:"على ضفاف المتوسط، تحافظ تيبازة على موقع أثري واسع مصنف ضمن اليونسكو: مسرح وبازيليكات ومدرج وجبانات ورثت عن الفينيقيين والرومان ثم أوائل المسيحيين. أمام الآثار، يقدم البحر والبلدة الحديثة الصغيرة أحد أجمل مناظر الساحل الجزائري." }
    },
    'kabylie-djurdjura': {
      img:'promo/pic-kabylie.jpg',
      fr:{ title:'Djurdjura & Kabylie', sub:'Excursion · 2 jours', book:'Djurdjura & Kabylie',
        text:"La Kabylie est le pays des montagnes et des villages perchés. Le parc national du Djurdjura, avec le pic de Lalla Khedidja, culmine à plus de 2 300 mètres. Forêts de cèdres, cascades et grottes se découvrent entre villages berbères aux traditions ancestrales, sur les hauteurs qui dominent la plaine et la mer." },
      en:{ title:'Djurdjura & Kabylia', sub:'Excursion · 2 days', book:'Djurdjura & Kabylia',
        text:"Kabylia is the land of mountains and perched villages. The Djurdjura national park, with the Lalla Khedidja peak, rises to over 2,300 metres. Cedar forests, waterfalls and caves are discovered among Berber villages with age-old traditions, on the heights overlooking the plain and the sea." },
      ar:{ title:'جرجرة والقبائل', sub:'رحلة · يومان', book:'جرجرة والقبائل',
        text:"منطقة القبائل أرض الجبال والقرى المتلاصقة. يبلغ قمة منتزه جرجرة الوطني، مع قمة لالة خديجة، أكثر من 2300 متر. تُكتشف غابات الأرز والشلالات والكهوف بين القرى الأمازيغية ذات التقاليد العريقة، على المرتفعات المطلة على السهل والبحر." }
    },
    'ghardaia-mzab': {
      img:'promo/pic-ghardaia.jpg',
      fr:{ title:'Ghardaïa & la Vallée du M\'Zab', sub:'Excursion · 2 jours', book:'Ghardaïa et la Vallée du M\'Zab',
        text:"Au cœur du Sahara, Ghardaïa est la principale des cinq cités fortifiées de la pentapole du M'Zab, érigée au XIe siècle par la communauté ibadite. Villages-citadelles en pisé, mosquées-pyramides, palmeraies et souks donnent à la vallée une silhouette unique, classée au patrimoine mondial de l'UNESCO." },
      en:{ title:'Ghardaïa & the M\'Zab Valley', sub:'Excursion · 2 days', book:'Ghardaïa and the M\'Zab Valley',
        text:"In the heart of the Sahara, Ghardaïa is the main of the five fortified cities of the M'Zab pentapolis, raised in the 11th century by the Ibadi community. Fortress villages in pisé, pyramid mosques, palm groves and souks give the valley a unique silhouette, listed as a UNESCO World Heritage site." },
      ar:{ title:'غرداية ووادي مزاب', sub:'رحلة · يومان', book:'غرداية ووادي مزاب',
        text:"في قلب الصحراء، غرداية هي الرئيسية من بين المدن الخمس المحصنة في خماسية مزاب، التي أقامتها الجماعة الأباضية في القرن الحادي عشر. قرى حصينة من الطوب، مساجد هرمية، واحات نخيل وأسواق تكسب الوادي طابعاً فريداً مصنفاً ضمن التراث العالمي لليونسكو." }
    },
    'tlemcen': {
      img:'promo/pic-tlemcen.jpg',
      fr:{ title:'Tlemcen, la Perle du Maghreb', sub:'Excursion · 1 jour', book:'Tlemcen, la Perle du Maghreb',
        text:"Tlemcen garde la mémoire des royaumes almohade et zianide. La Grande Mosquée, le minaret de la forteresse de Mansourah et les mausolées de Sidi Boumediene témoignent d'un âge d'or de plus de sept siècles. Entre monts des Trara et vignobles, ses medersas et palais racontent une grande capitale musulmane." },
      en:{ title:'Tlemcen, Pearl of the Maghreb', sub:'Excursion · 1 day', book:'Tlemcen, Pearl of the Maghreb',
        text:"Tlemcen keeps the memory of the Almohad and Zayyanid kingdoms. The Great Mosque, the minaret of the Mansourah fortress and the mausoleums of Sidi Boumediene bear witness to a golden age of over seven centuries. Between the Trara mountains and vineyards, its madrasas and palaces tell of a great Muslim capital." },
      ar:{ title:'تلمسان لؤلؤة المغرب العربي', sub:'رحلة · يوم واحد', book:'تلمسان لؤلؤة المغرب العربي',
        text:"تحفظ تلمسان ذكرى مملكتي الموحدين والزيانيين. يشهد الجامع الكبير ومئذنة قلعة المنصورة وأضرحة سيدي بومدين على عصر ذهبي امتد لأكثر من سبعة قرون. بين جبال ترارة والكروم، تحكي مدارسها وقصورها قصة عاصمة إسلامية كبرى." }
    },

    /* ------- Excursions Extérieur ------- */
    'baku': {
      img:'promo/pic-baku.jpg',
      fr:{ title:'Bakou, la Perle de la Caspienne', sub:'International · 4 jours', book:'Bakou, la Perle de la Caspienne',
        text:"Bakou, capitale de l'Azerbaïdjan, épouse la côte de la mer Caspienne. La vieille ville (Icheri Sheher), classée à l'UNESCO, abrite le palais des Chirvanshahs et la tour de la Vierge. Face à l'ancien quartier, les Flame Towers et l'architecture contemporaine dessinent le nouveau visage d'une capitale entre orient et modernité." },
      en:{ title:'Baku, Pearl of the Caspian', sub:'International · 4 days', book:'Baku, Pearl of the Caspian',
        text:"Baku, capital of Azerbaijan, hugs the shore of the Caspian Sea. The old city (Icheri Sheher), a UNESCO site, houses the Palace of the Shirvanshahs and the Maiden Tower. Facing the old quarter, the Flame Towers and contemporary architecture draw the new face of a capital between East and modernity." },
      ar:{ title:'باكو لؤلؤة بحر قزوين', sub:'دولي · 4 أيام', book:'باكو لؤلؤة بحر قزوين',
        text:"باكو، عاصمة أذربيجان، تلامس شاطئ بحر قزوين. تضم المدينة القديمة (إتشري شهير)، المصنفة ضمن اليونسكو، قصر الشيروانشاه وبرج العذراء. أما أمام الحي القديم، فترسم أبراج اللهب والهندسة المعاصرة الوجه الجديد لعاصمة بين الشرق والحداثة." }
    },
    'moscou': {
      img:'promo/pic-moscow.jpg',
      fr:{ title:'Moscou, la Ville Rouge', sub:'International · 5 jours', book:'Moscou, la Ville Rouge',
        text:"Moscou est le cœur de la Russie. La place Rouge, le Kremlin aux murs de briques et la cathédrale Saint-Basile aux coupoles colorées racontent six siècles d'histoire impériale puis soviétique. Le métro, véritable musée souterrain, et les rives de la Moskova prolongent la découverte de la capitale russe." },
      en:{ title:'Moscow, the Red City', sub:'International · 5 days', book:'Moscow, the Red City',
        text:"Moscow is the heart of Russia. Red Square, the brick-walled Kremlin and Saint Basil's Cathedral with its coloured domes tell six centuries of imperial then Soviet history. The metro, a true underground museum, and the banks of the Moskva extend the discovery of the Russian capital." },
      ar:{ title:'موسكو المدينة الحمراء', sub:'دولي · 5 أيام', book:'موسكو المدينة الحمراء',
        text:"موسكو هي قلب روسيا. تحكي الساحة الحمراء، والكرملين بجدرانه الآجرية، وكاتدرائية القديس باسيليوس بقبابها الملونة، ستة قرون من التاريخ الإمبراطوري ثم السوفيتي. يطيل المترو، وهو متحف حقيقي تحت الأرض، وضفاف نهر موسكفا من اكتشاف العاصمة الروسية." }
    },
    'istanbul-deux-continents': {
      img:'promo/ext-turkey.jpg',
      fr:{ title:'Istanbul, entre Deux Continents', sub:'International · 4 jours', book:'Istanbul, entre Deux Continents',
        text:"Quatre jours pour goûter au carrefour de l'Europe et de l'Asie. Sainte-Sophie, édifiée par les Byzantins, devint mosquée puis monument de l'UNESCO ; le Grand Bazar, l'un des plus anciens marchés couverts du monde, et les palais ottomans rappellent le génie d'Istanbul. Une croisière sur le Bosphore relie les deux rives." },
      en:{ title:'Istanbul, Between Two Continents', sub:'International · 4 days', book:'Istanbul, Between Two Continents',
        text:"Four days to savour the crossroads of Europe and Asia. Hagia Sophia, built by the Byzantines, became a mosque then a UNESCO monument; the Grand Bazaar, one of the oldest covered markets in the world, and the Ottoman palaces recall Istanbul's genius. A cruise on the Bosphorus links the two shores." },
      ar:{ title:'إسطنبول بين قارتين', sub:'دولي · 4 أيام', book:'إسطنبول بين قارتين',
        text:"أربعة أيام لتذوق ملتقى أوروبا وآسيا. آيا صوفيا، التي شيدها البيزنطيون، أصبحت مسجداً ثم معلماً من معالم اليونسكو؛ والبازار الكبير، أحد أقدم الأسواق المغطاة في العالم، والقصور العثمانية تذكر بعبقرية إسطنبول. رحلة بحرية على البوسفور تربط الضفتين." }
    },
    'tunis-kairouan': {
      img:'promo/ext-tunisia.jpg',
      fr:{ title:'Tunis & Kairouan', sub:'International · 3 jours', book:'Tunis & Kairouan',
        text:"De la médina de Tunis, classée à l'UNESCO, à la ville sainte de Kairouan, la Tunisie déroule son histoire. Kairouan, fondée en 670, fut la première capitale de l'Ifriquiya et sa Grande Mosquée abrite l'un des plus anciens minarets du monde. Sidi Bou Saïd, village blanc et bleu, ouvre vers la mer." },
      en:{ title:'Tunis & Kairouan', sub:'International · 3 days', book:'Tunis & Kairouan',
        text:"From the UNESCO-listed medina of Tunis to the holy city of Kairouan, Tunisia unfolds its history. Kairouan, founded in 670, was the first capital of Ifriqiya and its Great Mosque houses one of the oldest minarets in the world. Sidi Bou Saïd, a white-and-blue village, opens onto the sea." },
      ar:{ title:'تونس والقيروان', sub:'دولي · 3 أيام', book:'تونس والقيروان',
        text:"من المدينة العتيقة بتونس، المصنفة ضمن اليونسكو، إلى مدينة القيروان المقدسة، تعرض تونس تاريخها. القيروان، التي تأسست سنة 670، كانت أول عاصمة لإفريقية، ويضم جامعها الكبير أحد أقدم المآذن في العالم. قرية سيدي بوسعيد البيضاء الزرقاء تطل على البحر." }
    },
    'omra-maccah-medine': {
      img:'promo/ext-saudi.jpg',
      fr:{ title:'Omra à la Maccah & Médine', sub:'International · Sur devis', book:'Omra à la Maccah & Médine',
        text:"Un voyage spirituel encadré de bout en bout vers les villes saintes de l'islam. À La Maccah, la mosquée Al-Haram enserre la Kaaba ; à Médine, la mosquée du Prophète accueille les pèlerins. Visas, vols, hébergement proche des Lieux Saints et accompagnement sur place sont compris." },
      en:{ title:'Omra in Makkah & Medina', sub:'International · On request', book:'Omra in Makkah & Medina',
        text:"A fully accompanied spiritual journey to the holy cities of Islam. In Makkah, the Al-Haram mosque encloses the Kaaba; in Medina, the Prophet's Mosque welcomes pilgrims. Visas, flights, accommodation near the Holy Sites and on-site accompaniment are included." },
      ar:{ title:'عمرة مكة والمدينة', sub:'دولي · حسب الطلب', book:'عمرة مكة والمدينة',
        text:"رحلة روحية مرافقة من البداية إلى النهاية إلى مدينتي الإسلام المقدستين. في مكة، يحيط المسجد الحرام بالكعبة؛ وفي المدينة، يستقبل المسجد النبوي الحجاج. التأشيرات والطيران والإقامة القريبة من الأماكن المقدسة والمرافقة في الموقع كلها مشمولة." }
    }
  };

  if (document.getElementById('detailModal')) return;
  document.body.insertAdjacentHTML('beforeend',
    '<div class="modal-overlay" id="detailModal">' +
      '<div class="modal-box modal-box-detail">' +
        '<button type="button" class="modal-close" id="detailClose">&times;</button>' +
        '<div class="detail-hero"><img id="detailImg" alt="" /></div>' +
        '<div class="detail-content">' +
          '<h3 class="detail-title" id="detailTitle"></h3>' +
          '<p class="detail-text" id="detailText"></p>' +
          '<div class="detail-info" id="detailInfo"></div>' +
          '<h4 class="detail-sec" id="detailProgTitle">Programme</h4>' +
          '<div class="detail-program" id="detailProgram"></div>' +
          '<button type="button" class="btn detail-reserve" id="detailReserve" data-i18n="detail_reserve">Réserver cet itinéraire</button>' +
        '</div>' +
      '</div>' +
    '</div>'
  );

  var dOverlay = document.getElementById('detailModal');
  var dImg = document.getElementById('detailImg');
  var dTitle = document.getElementById('detailTitle');
  var dText = document.getElementById('detailText');
  var dReserve = document.getElementById('detailReserve');
  var lastDetailSlug = null;

  function detailLang(d){
    var L = window.currentLang || 'fr';
    return (d && d[L]) ? L : 'fr';
  }

  var TERMS = {
    fr:[
      {t:'🧒', h:'Réductions enfants', d:'1er enfant (0 à 4.99 ans) : GRATUIT en partageant la chambre des parents.\n2ème enfant (5 à 10.99 ans) : -50% en partageant la chambre des parents.\nEnfant de 11 ans et plus : facturé au tarif adulte.'},
      {t:'OFF', h:'Services non inclus', d:'Billets d’avion internationaux et taxes de départ (si applicables).\nAccompagnement auprès de l’ambassade algérienne pour compléter la demande de visa (si nécessaire).\nBoissons non mentionnées dans le programme.\nDépenses personnelles (blanchisserie, etc.).\nAssurance voyage.'},
      {t:'✅', h:'Services inclus', d:'Accueil et raccompagnement à l’aéroport avec service de transfert.\nHébergement de 4 nuits dans les hôtels proposés ou équivalents (3*-4*).\nPetit-déjeuner quotidien dans les hôtels mentionnés.\nRepas prévus au programme dans les restaurants locaux et les hôtels.\nUne bouteille d’eau minérale gratuite par personne et par jour dans le bus.\nDéplacements en bus touristique moderne et climatisé.\nToutes les taxes et frais de service.'},
      {t:'ℹ️', h:'Informations pratiques', d:'Numéros de téléphone des représentants de la compagnie :\n+213 661 176 200 · +213 551 848 423 · +213 330 078 821\nVeuillez contacter nos représentants pour confirmer les horaires de départ et de transfert.\nArrivée à l’aéroport : il est recommandé d’arriver au moins 4 heures avant l’heure de décollage du vol.\nTous les jours de la semaine.'},
      {t:'💳', h:'Options de confirmation et de paiement', d:'40% lors de la réservation\n30% un mois avant la date d’arrivée\n30% deux semaines avant la date d’arrivée'}
    ],
    en:[
      {t:'🧒', h:'Child discounts', d:'1st child (0 to 4.99 years): FREE when sharing the parents’ room.\n2nd child (5 to 10.99 years): 50% off when sharing the parents’ room.\nChild aged 11 and over: charged the adult rate.'},
      {t:'OFF', h:'Services not included', d:'International flight tickets and departure taxes (if applicable).\nAccompaniment at the Algerian embassy to complete the visa application (if needed).\nDrinks not mentioned in the program.\nPersonal expenses (laundry, etc.).\nTravel insurance.'},
      {t:'✅', h:'Services included', d:'Airport welcome and drop-off with transfer service.\n4 nights accommodation in the proposed hotels or equivalent (3*-4*).\nDaily breakfast in the mentioned hotels.\nMeals scheduled in the program at local restaurants and hotels.\nOne free mineral water bottle per person per day on the coach.\nTransport by modern air-conditioned tourist coach.\nAll taxes and service fees.'},
      {t:'ℹ️', h:'Practical information', d:'Company representatives’ phone numbers:\n+213 661 176 200 · +213 551 848 423 · +213 330 078 821\nPlease contact our representatives to confirm departure and transfer times.\nAirport arrival: it is recommended to arrive at least 4 hours before the flight departure time.\nEvery day of the week.'},
      {t:'💳', h:'Confirmation and payment options', d:'40% at the time of booking\n30% one month before the arrival date\n30% two weeks before the arrival date'}
    ],
    ar:[
      {t:'🧒', h:'خصومات الأطفال', d:'الطفل الأول (من 0 إلى 4.99 سنوات): مجاناً عند الإقامة في غرفة الوالدين.\nالطفل الثاني (من 5 إلى 10.99 سنوات): خصم 50% عند الإقامة في غرفة الوالدين.\nالطفل من سن 11 سنة فما فوق: يُحاسب بسعر البالغين.'},
      {t:'OFF', h:'الخدمات التي لا يشملها البرنامج', d:'تذاكر الطيران الدولية ورسوم المغادرة (أن وجدت).\nمرافقة لدى السفارة الجزائرية من أجل استكمال إجراءات طلب التأشيرة (عند الحاجة).\nالمشروبات غير المذكورة في البرنامج.\nالمصاريف الشخصية مثل غسيل الملابس.\nالتأمين على السفر.'},
      {t:'✅', h:'الخدمات التي يشملها البرنامج', d:'الاستقبال والتوديع بالمطار مع خدمة النقل.\nالإقامة لمدة أربع ليالٍ في الفنادق المقترحة أو ما يعادلها (*3-4*).\nإفطار يومي في الفنادق المذكورة.\nالوجبات المدرجة ضمن البرنامج في المطاعم المحلية والفنادق.\nزجاجة مياه معدنية مجانية لكل شخص يومياً داخل الحافلة طوال مدة البرنامج.\nالتنقل بحافلة سياحية حديثة ومكيفة.\nجميع الضرائب ورسوم الخدمة.'},
      {t:'ℹ️', h:'معلومات عملية', d:'أرقام هواتف ممثلي الشركة:\n+213 661 176 200 · +213 551 848 423 · +213 330 078 821\nيرجى من الضيوف التواصل مع ممثلينا لتأكيد مواعيد المغادرة والنقل.\nموعد الوصول إلى المطار: ينصح بالوصول قبل موعد إقلاع الرحلة بأربع ساعات على الأقل.\nطوال أيام الأسبوع.'},
      {t:'💳', h:'خيارات التأكيد والدفع', d:'40% عند الحجز\n30% قبل موعد الوصول بشهر\n30% قبل موعد الوصول بأسبوعين'}
    ]
  };
  function renderDetailBody(d, L){
    var imgSrc = (typeof d.img === 'object' && d.img) ? (d.img[L] || d.img.fr || '') : (d.img || '');
    dImg.src = imgSrc ? 'assets/' + imgSrc : 'assets/hero-morning.png';
    dImg.alt = d[L].title;
    dTitle.textContent = d[L].title;
    dText.textContent = d[L].text;
    var infoEl = document.getElementById('detailInfo');
    if (infoEl){
      var k = d[L].info || d.fr.info || [];
      infoEl.innerHTML = k.map(function(i){ return '<span class="detail-chip">' + i + '</span>'; }).join('');
    }
    var progEl = document.getElementById('detailProgram');
    var progTitle = document.getElementById('detailProgTitle');
    if (progTitle) progTitle.textContent = (L === 'ar') ? 'البرنامج' : (L === 'en' ? 'Program' : 'Programme');
    if (progEl){
      var p = d[L].program || d.fr.program || [];
      if (p && p.length){
        if (progTitle) progTitle.style.display = '';
        var withTerms = ['constantine-tunisia','constantine-carthage','algeria-escapes','homes-of-the-righteous'].indexOf(lastDetailSlug) !== -1;
        var terms = (withTerms ? (TERMS[L] || TERMS.fr || []) : []).slice();
        var steps = p.concat(terms);
        progEl.innerHTML = steps.map(function(step){
          return '<div class="detail-step"><span class="step-time">' + step.t + '</span><div class="step-body"><strong>' + step.h + '</strong><span>' + step.d + '</span></div></div>';
        }).join('');
      } else {
        if (progTitle) progTitle.style.display = 'none';
        progEl.innerHTML = '';
      }
    }
    dReserve.onclick = function(){
      openBook(d[L].book || d[L].title, d[L].sub);
      closeDetail();
    };
  }

  window.openDetail = function(slug){
    var d = DETAILS[slug];
    if (!d) return;
    lastDetailSlug = slug;
    var L = detailLang(d);
    renderDetailBody(d, L);
    dOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  window.closeDetail = function(){
    dOverlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  function renderDetail(){
    if (!dOverlay.classList.contains('open') || !lastDetailSlug) return;
    var d = DETAILS[lastDetailSlug];
    if (!d) return;
    renderDetailBody(d, detailLang(d));
  }
  window._langHandlers = window._langHandlers || [];
  window._langHandlers.push(renderDetail);
  document.getElementById('detailClose').addEventListener('click', closeDetail);
  dOverlay.addEventListener('click', function(e){ if (e.target === dOverlay) closeDetail(); });

  document.querySelectorAll('[data-detail]').forEach(function(btn){
    btn.addEventListener('click', function(){ openDetail(btn.dataset.detail); });
  });

  window.DETAILS = DETAILS;
})();

/* =========================================================================
   DESTINATION QUIZ — "Get help finding your destination".
   12 questions, scored on 8 dimensions, recomputed live so the
   recommended destination updates when answers change.
   ========================================================================= */
(function(){
  /* dimensions: 0 Spiritual, 1 Histoire, 2 Nature, 3 Désert, 4 Ville, 5 Détente/Mer, 6 International, 7 Escapade */
  var DIMS = ['Spiritualité','Histoire & culture','Nature','Désert & aventure','Ville & patrimoine','Détente & mer','International','Escapade'];

  var QUIZ = [
    {q:{fr:"Quelle est votre motivation principale pour ce voyage ?", en:"What is your main motivation for this trip?", ar:"ما هو الدافع الرئيسي لرحلتك؟"}, o:[
      {t:{fr:"Nourrir ma foi et mon âme", en:"Nurture my faith and soul", ar:"تغذية إيماني وروحي"}, w:{0:3}},
      {t:{fr:"Découvrir l'histoire et le patrimoine", en:"Discover history and heritage", ar:"اكتشاف التاريخ والتراث"}, w:{1:3}},
      {t:{fr:"Explorer les grands espaces et la nature", en:"Explore wide open spaces and nature", ar:"استكشاف الفضاءات الواسعة والطبيعة"}, w:{2:3}},
      {t:{fr:"Me détendre au bord de la mer", en:"Relax by the sea", ar:"الاسترخاء بجانب البحر"}, w:{5:3}}
    ]},
    {q:{fr:"Quelle durée de voyage idéale ?", en:"What is your ideal trip length?", ar:"كم تفضل أن تكون مدة الرحلة؟"}, o:[
      {t:{fr:"Un week-end (1-2 jours)", en:"A weekend (1-2 days)", ar:"عطلة نهاية أسبوع (1-2 يوم)"}, w:{7:2}},
      {t:{fr:"3 à 5 jours", en:"3 to 5 days", ar:"من 3 إلى 5 أيام"}, w:{1:1,4:1}},
      {t:{fr:"5 à 10 jours", en:"5 to 10 days", ar:"من 5 إلى 10 أيام"}, w:{2:1,3:1}},
      {t:{fr:"Plus de 10 jours, loin", en:"More than 10 days, far away", ar:"أكثر من 10 أيام، بعيداً"}, w:{6:2}}
    ]},
    {q:{fr:"Quel est votre budget approximatif ?", en:"What is your approximate budget?", ar:"ما هو ميزانيتك التقريبية؟"}, o:[
      {t:{fr:"Économique", en:"Budget-friendly", ar:"اقتصادي"}, w:{7:2}},
      {t:{fr:"Moyen", en:"Moderate", ar:"متوسط"}, w:{1:1}},
      {t:{fr:"Premium, sans compter", en:"Premium, no limits", ar:"فاخر، دون حساب"}, w:{6:2,0:1}},
      {t:{fr:"Peu importe", en:"No matter", ar:"لا يهم"}, w:{}}
    ]},
    {q:{fr:"Qui vous accompagne ?", en:"Who is travelling with you?", ar:"من يرافقك؟"}, o:[
      {t:{fr:"Seul(e)", en:"Alone", ar:"بمفردي"}, w:{1:1,3:1}},
      {t:{fr:"En couple", en:"As a couple", ar:"كثنائي"}, w:{5:2,2:1}},
      {t:{fr:"En famille", en:"As a family", ar:"كعائلة"}, w:{5:2,4:1}},
      {t:{fr:"Un groupe d'amis", en:"A group of friends", ar:"مجموعة أصدقاء"}, w:{3:1,4:1}}
    ]},
    {q:{fr:"Quel type de site vous attire le plus ?", en:"Which type of site attracts you the most?", ar:"أي نوع من المواقع يجذبك أكثر؟"}, o:[
      {t:{fr:"Ruines antiques et archéologie", en:"Ancient ruins and archaeology", ar:"آثار قديمة وعلم الآثار"}, w:{1:3}},
      {t:{fr:"Villes, médinas et palais", en:"Cities, medinas and palaces", ar:"مدن وقصبات وقصور"}, w:{4:3}},
      {t:{fr:"Oasis, dunes et désert", en:"Oases, dunes and desert", ar:"واحات وكثبان وصحراء"}, w:{3:3}},
      {t:{fr:"Montagnes et paysages sauvages", en:"Mountains and wild landscapes", ar:"جبال ومناظر برية"}, w:{2:3}}
    ]},
    {q:{fr:"Quel rythme de voyage préférez-vous ?", en:"What travel pace do you prefer?", ar:"ما هي وتيرة السفر التي تفضلها؟"}, o:[
      {t:{fr:"Très actif, plein d'aventures", en:"Very active, full of adventures", ar:"نشيط جداً ومليء بالمغامرات"}, w:{3:2,2:2}},
      {t:{fr:"Équilibré entre visites et repos", en:"Balanced between visits and rest", ar:"متوازن بين الزيارات والراحة"}, w:{1:1,5:1}},
      {t:{fr:"Tranquille et reposant", en:"Calm and relaxing", ar:"هادئ ومريح"}, w:{5:3}}
    ]},
    {q:{fr:"Le climat préféré ?", en:"Preferred climate?", ar:"المناخ المفضل؟"}, o:[
      {t:{fr:"Chaud et ensoleillé", en:"Hot and sunny", ar:"حار ومشمس"}, w:{3:1,5:1}},
      {t:{fr:"Fraîcheur des hauteurs", en:"Cool of the highlands", ar:"برودة المرتفعات"}, w:{2:2}},
      {t:{fr:"Peu importe", en:"No matter", ar:"لا يهم"}, w:{}}
    ]},
    {q:{fr:"Voulez-vous être accompagné(e) ?", en:"Do you want to be accompanied?", ar:"هل تريد أن تكون مرافقاً؟"}, o:[
      {t:{fr:"Oui, par un guide spirituel", en:"Yes, by a spiritual guide", ar:"نعم، عبر مرشد روحي"}, w:{0:2}},
      {t:{fr:"Oui, par un guide culturel", en:"Yes, by a cultural guide", ar:"نعم، عبر مرشد ثقافي"}, w:{1:2}},
      {t:{fr:"Pas nécessaire", en:"Not necessary", ar:"ليس ضرورياً"}, w:{}}
    ]},
    {q:{fr:"Votre priorité absolue ?", en:"Your absolute priority?", ar:"أولويتك القصوى؟"}, o:[
      {t:{fr:"Une découverte spirituelle", en:"A spiritual discovery", ar:"اكتشاف روحي"}, w:{0:3}},
      {t:{fr:"Enrichir ma culture", en:"Enrich my culture", ar:"إثراء ثقافتي"}, w:{1:2,4:1}},
      {t:{fr:"La grandeur des paysages", en:"The grandeur of the landscapes", ar:"عظمة المناظر الطبيعية"}, w:{2:2,3:1}},
      {t:{fr:"Découvrir d'autres cultures à l'étranger", en:"Discover other cultures abroad", ar:"اكتشاف ثقافات أخرى في الخارج"}, w:{6:3}}
    ]},
    {q:{fr:"Quel moment recherchez-vous ?", en:"What kind of moment are you looking for?", ar:"أي لحظة تبحث عنها؟"}, o:[
      {t:{fr:"Un temps de recueillement", en:"A time of reflection", ar:"وقت تأمل"}, w:{0:2}},
      {t:{fr:"Un voyage d'apprentissage", en:"A learning journey", ar:"رحلة تعلم"}, w:{1:2}},
      {t:{fr:"L'aventure et l'évasion", en:"Adventure and escape", ar:"المغامرة والهروب من الروتين"}, w:{3:2,2:2}},
      {t:{fr:"Un pur repos", en:"Pure rest", ar:"راحة تامة"}, w:{5:3}}
    ]},
    {q:{fr:"Le transport qui vous tente ?", en:"Which transport appeals to you?", ar:"أي وسيلة نقل تغريك؟"}, o:[
      {t:{fr:"Prendre l'avion, partir loin", en:"Take a plane, go far away", ar:"أخذ الطائرة والسفر بعيداً"}, w:{6:2}},
      {t:{fr:"Routes, pistes et découvertes locales", en:"Roads, tracks and local discoveries", ar:"طرق ومسارات واكتشافات محلية"}, w:{3:1,2:1,1:1}},
      {t:{fr:"Peu importe", en:"No matter", ar:"لا يهم"}, w:{}}
    ]},
    {q:{fr:"À la fin du voyage, le plus important sera d'avoir…", en:"At the end of the trip, the most important will be to have…", ar:"في نهاية الرحلة، الأهم سيكون أن…"}, o:[
      {t:{fr:"Rentré transformé(e), apaisé(e)", en:"Returned transformed and at peace", ar:"تعود متغيراً ومسالماً"}, w:{0:3}},
      {t:{fr:"Beaucoup appris", en:"Learned a lot", ar:"تتعلم الكثير"}, w:{1:3}},
      {t:{fr:"Été complètement dépaysé(e)", en:"Been completely far away", ar:"كنت بعيداً تماماً عن المألوف"}, w:{3:2,2:2}},
      {t:{fr:"Vraiment reposé(e)", en:"Truly rested", ar:"تستريح حقاً"}, w:{5:3}}
    ]}
  ];

  var OUTCOMES = [
    {slug:'sur-les-traces-des-saints', p:[5,4,0,0,2,1,0,1]},
    {slug:'omra-premium',              p:[5,1,0,0,0,0,0,1]},
    {slug:'route-du-grand-sud',        p:[0,1,2,5,0,0,0,3]},
    {slug:'tassili-ajjer',             p:[0,2,3,5,0,0,0,3]},
    {slug:'ghardaia-mzab',             p:[1,3,1,3,1,0,0,1]},
    {slug:'tipaza',                    p:[1,4,2,0,1,3,0,1]},
    {slug:'constantine',               p:[0,4,1,0,3,0,0,1]},
    {slug:'annaba-hippone',            p:[3,4,1,0,1,2,0,1]},
    {slug:'kabylie-djurdjura',         p:[0,1,5,1,0,0,0,1]},
    {slug:'littoral-est',              p:[0,2,2,0,0,5,0,1]},
    {slug:'casbah-medinas',            p:[0,3,0,0,5,1,0,1]},
    {slug:'tlemcen',                   p:[1,4,0,0,3,0,0,1]},
    {slug:'istanbul-cappadoce',        p:[0,3,0,0,5,2,4,1]},
    {slug:'imperial-tour',             p:[0,4,0,0,4,0,3,1]},
    {slug:'nil-croisiere',             p:[0,5,0,0,1,4,4,1]},
    {slug:'baku',                      p:[0,2,0,0,4,1,4,1]},
    {slug:'moscou',                    p:[0,4,0,0,3,0,4,1]},
    {slug:'tunis-kairouan',            p:[3,3,1,0,2,2,2,1]}
  ];

  if (document.getElementById('quizModal')) return;
  document.body.insertAdjacentHTML('beforeend',
    '<div class="modal-overlay" id="quizModal">' +
      '<div class="modal-box modal-box-quiz">' +
        '<button type="button" class="modal-close" id="quizClose">&times;</button>' +
        '<div class="quiz-head" id="quizHead">' +
          '<h3 class="modal-title" data-i18n="quiz_title">Trouvez votre destination idéale</h3>' +
          '<p class="modal-sub" id="quizProgress"></p>' +
          '<div class="quiz-bar"><div class="quiz-bar-fill" id="quizBarFill"></div></div>' +
          '<div class="quiz-body"><h4 class="quiz-question" id="quizQuestion"></h4><div class="quiz-options" id="quizOptions"></div></div>' +
          '<div class="quiz-nav"><button type="button" class="btn outline" id="quizBack" data-i18n="quiz_back">← Précédent</button>' +
            '<button type="button" class="quiz-restart" id="quizRestart" data-i18n="quiz_restart">Recommencer ↺</button></div>' +
        '</div>' +
        '<div class="quiz-result" id="quizResult" style="display:none;"></div>' +
      '</div>' +
    '</div>'
  );

  var overlay = document.getElementById('quizModal');
  var head = document.getElementById('quizHead');
  var resultEl = document.getElementById('quizResult');
  var progress = document.getElementById('quizProgress');
  var barFill = document.getElementById('quizBarFill');
  var qTitle = document.getElementById('quizQuestion');
  var optWrap = document.getElementById('quizOptions');
  var backBtn = document.getElementById('quizBack');
  var restartBtn = document.getElementById('quizRestart');

  var answers = new Array(QUIZ.length).fill(null); // selected option index per question
  var current = 0;

  function quizT(key){
    var d = getMergedTranslations()[window.currentLang || 'fr'];
    return (d && d[key] !== undefined) ? d[key] : key;
  }
  window._langHandlers = window._langHandlers || [];
  window._langHandlers.push(function(){
    if (overlay.classList.contains('open')){
      if (resultEl.style.display === 'block') showResult(); else renderQuestion();
    }
  });

  function maxDim(){
    var m = new Array(8).fill(0);
    QUIZ.forEach(function(qu){ qu.o.forEach(function(opt){ for (var k in opt.w){ m[k]=Math.max(m[k],opt.w[k]); } }); });
    return m;
  }
  var MAXDIM = maxDim();

  function compute(){
    var dims = new Array(8).fill(0);
    answers.forEach(function(ai, qi){
      if (ai == null) return;
      var opt = QUIZ[qi].o[ai];
      for (var k in opt.w){ dims[k] += opt.w[k]; }
    });
    var ranked = OUTCOMES.map(function(o){
      var dot = 0, denom = 0;
      for (var i=0;i<8;i++){ dot += dims[i]*o.p[i]; denom += o.p[i]*MAXDIM[i]; }
      return {slug:o.slug, score: denom ? Math.round(dot/denom*100) : 0};
    }).sort(function(a,b){ return b.score - a.score; });
    return ranked;
  }

  function renderQuestion(){
    var L = window.currentLang || 'fr';
    var qu = QUIZ[current];
    qTitle.textContent = qu.q[L];
    progress.textContent = quizT('quiz_progress') + ' ' + (current+1) + ' / ' + QUIZ.length;
    barFill.style.width = (Math.round((current)/(QUIZ.length)*100)) + '%';
    optWrap.innerHTML = '';
    qu.o.forEach(function(opt, idx){
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'quiz-opt' + (answers[current]===idx ? ' sel' : '');
      b.textContent = opt.t[L];
      b.addEventListener('click', function(){
        answers[current] = idx;
        optWrap.querySelectorAll('.quiz-opt').forEach(function(x){ x.classList.remove('sel'); });
        b.classList.add('sel');
        if (current === QUIZ.length-1){ showResult(); }
        else { current++; renderQuestion(); }
      });
      optWrap.appendChild(b);
    });
    backBtn.disabled = (current === 0);
  }

  function showResult(){
    function qT(key){
      var dl = getMergedTranslations()[window.currentLang || 'fr'];
      return (dl && dl[key] !== undefined) ? dl[key] : key;
    }
    var ranked = compute();
    var top = ranked[0];
    var L = window.currentLang || 'fr';
    var d = (window.DETAILS && window.DETAILS[top.slug]) ? window.DETAILS[top.slug] : null;
    var dd = d ? (d[L] || d.fr || null) : null;
    head.style.display = 'none';
    var topPct = top.score || 100;
    var html = '';
    if (dd){
      html += '<div class="result-pick"><img src="assets/' + d.img + '" alt="' + dd.title.replace(/"/g,'&quot;') + '"></div>';
      html += '<div class="result-title">' + dd.title + '</div>';
      html += '<div class="result-match">' + qT('quiz_match') + ' ' + topPct + '%</div>';
      html += '<p class="result-text">' + dd.text + '</p>';
    } else {
      html += '<div class="result-title">' + qT('quiz_recommended') + '</div>';
    }
    html += '<div class="result-list"><h5>' + qT('quiz_result_title') + '</h5>';
    ranked.slice(0,4).forEach(function(r){
      var rd = (window.DETAILS && window.DETAILS[r.slug]) ? (window.DETAILS[r.slug][L] || window.DETAILS[r.slug].fr || {}) : null;
      var label = rd ? rd.title : r.slug;
      var pct = Math.round(r.score / topPct * 100);
      html += '<div class="match-row"><span class="mname">' + label + '</span>' +
        '<span class="mbar"><i style="width:' + pct + '%"></i></span>' +
        '<span class="mpct">' + pct + '%</span></div>';
    });
    html += '</div>';
    html += '<div class="result-actions">';
    if (dd){
      html += '<button type="button" class="btn outline" data-r-detail="' + top.slug + '">' + qT('quiz_detail') + '</button>';
      html += '<button type="button" class="btn" data-r-book data-r-name="' + (dd.book||dd.title).replace(/"/g,'&quot;') + '" data-r-sub="' + (dd.sub||'').replace(/"/g,'&quot;') + '">' + qT('quiz_book') + '</button>';
    }
    html += '</div>';
    resultEl.innerHTML = html;
    resultEl.style.display = 'block';

    var dbtn = resultEl.querySelector('[data-r-detail]');
    if (dbtn) dbtn.addEventListener('click', function(){ closeQuiz(); window.openDetail(dbtn.getAttribute('data-r-detail')); });
    var bbtn = resultEl.querySelector('[data-r-book]');
    if (bbtn) bbtn.addEventListener('click', function(){ closeQuiz(); window.openBook(bbtn.getAttribute('data-r-name'), bbtn.getAttribute('data-r-sub')); });
  }

  window.openQuiz = function(){
    answers = new Array(QUIZ.length).fill(null);
    current = 0;
    resultEl.style.display = 'none';
    head.style.display = '';
    renderQuestion();
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  window.closeQuiz = function(){
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  backBtn.addEventListener('click', function(){ if (current>0){ current--; resultEl.style.display='none'; head.style.display=''; renderQuestion(); } });
  restartBtn.addEventListener('click', function(){ answers = new Array(QUIZ.length).fill(null); current=0; resultEl.style.display='none'; head.style.display=''; renderQuestion(); });
  document.getElementById('quizClose').addEventListener('click', closeQuiz);
  overlay.addEventListener('click', function(e){ if (e.target === overlay) closeQuiz(); });

  document.querySelectorAll('[data-quiz]').forEach(function(btn){
    btn.addEventListener('click', openQuiz);
  });
})();

/* ---------- LIGHTBOX : click any photo to view it larger ---------- */
(function(){
  if (document.getElementById('lbOverlay')) return;
  var ov = document.createElement('div');
  ov.className = 'lb-overlay';
  ov.id = 'lbOverlay';
  ov.innerHTML =
    '<div class="lb-box">' +
      '<button type="button" class="lb-close" aria-label="Fermer">&times;</button>' +
      '<img src="" alt="">' +
      '<div class="lb-caption"></div>' +
    '</div>';
  document.body.appendChild(ov);
  var img = ov.querySelector('img');
  var cap = ov.querySelector('.lb-caption');
  function open(src, alt){
    if (!src) return;
    img.src = src;
    img.alt = alt || '';
    cap.textContent = alt || '';
    ov.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function close(){
    ov.classList.remove('open');
    document.body.style.overflow = '';
  }
  ov.addEventListener('click', function(e){ if (e.target === ov) close(); });
  ov.querySelector('.lb-close').addEventListener('click', close);
  document.addEventListener('keydown', function(e){ if (e.key === 'Escape') close(); });

  document.querySelectorAll('.gallery-strip img, .lightbox-img').forEach(function(el){
    el.addEventListener('click', function(){ open(el.getAttribute('src') || el.src, el.getAttribute('alt')); });
  });

  /* expose so the owner-pic added by pages is also wired on load */
  window.openLightbox = open;
  window.closeLightbox = close;
  document.addEventListener('click', function(e){
    var t = e.target;
    if (t && t.classList && t.classList.contains('gallery-strip') === false && t.tagName === 'IMG' && t.closest && t.closest('.gallery-strip, .lightbox-img') === null && t.closest('.lb-box') === null){
      /* no-op fallback */
    }
  });
})();
