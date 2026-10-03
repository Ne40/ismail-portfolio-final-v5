const qs=(s,c=document)=>c.querySelector(s);
const qsa=(s,c=document)=>[...c.querySelectorAll(s)];

// Legacy multi-page menu
const menu=qs('.menu-btn'),nav=qs('.nav');
if(menu&&nav){menu.addEventListener('click',()=>{nav.classList.toggle('open');menu.setAttribute('aria-expanded',nav.classList.contains('open'))})}

// Home menu
const menuToggle=qs('.menu-toggle'), mainNav=qs('.main-nav');
if(menuToggle&&mainNav){menuToggle.addEventListener('click',()=>{const open=mainNav.classList.toggle('open');menuToggle.setAttribute('aria-expanded',open)})}

// Reveal
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.12});
qsa('.reveal').forEach(el=>io.observe(el));

function applyTextLanguage(lang){
  document.documentElement.lang=lang;
  document.documentElement.dir=lang==='ar'?'rtl':'ltr';
  qsa('[data-en][data-ar]').forEach(el=>{el.innerHTML=el.dataset[lang]});
  qsa('[data-en-placeholder][data-ar-placeholder]').forEach(el=>el.placeholder=el.dataset[`${lang}Placeholder`]);
  qsa('[data-en-value][data-ar-value]').forEach(el=>el.value=el.dataset[`${lang}Value`]);
  qsa('.lang-btn,.language-btn').forEach(b=>b.classList.toggle('active',b.dataset.lang===lang));
  const body=document.body;
  if(body.dataset[`title${lang==='ar'?'Ar':'En'}`]) document.title=body.dataset[`title${lang==='ar'?'Ar':'En'}`];
  localStorage.setItem('ismail-lang',lang);
}

function setLang(lang,animate=true){
  const body=document.body;
  const legacyFlight=qs('.lang-flight');
  const homeFlight=qs('.language-transition');
  const flight=legacyFlight||homeFlight;
  if(animate&&flight){
    flight.className=`${legacyFlight?'lang-flight':'language-transition'} active ${lang==='ar'?'to-ar':'to-en'}`;
    body.classList.add('lang-switching');
  }
  setTimeout(()=>applyTextLanguage(lang),animate?320:0);
  setTimeout(()=>{
    body.classList.remove('lang-switching');
    if(flight) flight.className=legacyFlight?'lang-flight':'language-transition';
  },animate?850:0);
}
qsa('.lang-btn,.language-btn').forEach(b=>b.addEventListener('click',()=>setLang(b.dataset.lang,true)));
setLang(localStorage.getItem('ismail-lang')||'en',false);

// Contact forms
const forms=[qs('#mailto-form'),qs('#contactForm')].filter(Boolean);
forms.forEach(form=>form.addEventListener('submit',e=>{
  e.preventDefault();
  const d=new FormData(form),lang=localStorage.getItem('ismail-lang')||'en';
  const name=d.get('name')||'',email=d.get('email')||'',subject=d.get('subject')||'Freelance Project Inquiry',message=d.get('message')||'';
  const body=lang==='ar'?`أهلاً إسماعيل،\n\nالاسم: ${name}\nالإيميل: ${email}\n\nتفاصيل المشروع:\n${message}`:`Hi Ismail,\n\nName: ${name}\nEmail: ${email}\n\nProject details:\n${message}`;
  location.href=`mailto:nerovirusismail@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}));

// Project sliders
const projectSliders=qsa('[data-slider]');
projectSliders.forEach(slider=>{
  const slides=qsa('.project-slide',slider),prevBtn=qs('.slider-prev',slider),nextBtn=qs('.slider-next',slider),dotsWrap=qs('.slider-dots',slider);
  if(!slides.length)return;
  if(slides.length===1){slider.classList.add('is-single');slides[0].classList.add('is-active');return}
  let current=slides.findIndex(s=>s.classList.contains('is-active'));if(current<0)current=0;
  let timer=null;const interval=Number(slider.dataset.interval)||4000;
  const dots=slides.map((_,i)=>{const dot=document.createElement('button');dot.type='button';dot.className='slider-dot';dot.setAttribute('aria-label',`Show image ${i+1}`);dotsWrap.appendChild(dot);dot.addEventListener('click',()=>{showSlide(i);restart()});return dot});
  function showSlide(i){current=(i+slides.length)%slides.length;slides.forEach((s,j)=>s.classList.toggle('is-active',j===current));dots.forEach((d,j)=>d.classList.toggle('is-active',j===current))}
  const next=()=>showSlide(current+1),prev=()=>showSlide(current-1);
  const stop=()=>{if(timer){clearInterval(timer);timer=null}},start=()=>{stop();timer=setInterval(next,interval)},restart=()=>{stop();start()};
  nextBtn?.addEventListener('click',()=>{next();restart()});prevBtn?.addEventListener('click',()=>{prev();restart()});
  slider.addEventListener('mouseenter',stop);slider.addEventListener('mouseleave',start);slider.addEventListener('focusin',stop);slider.addEventListener('focusout',start);
  showSlide(current);start();
});
