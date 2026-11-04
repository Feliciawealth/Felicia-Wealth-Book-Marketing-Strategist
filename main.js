(function(){
  var burger=document.querySelector('.burger'),menu=document.querySelector('.menu');
  if(burger){burger.addEventListener('click',function(){burger.classList.toggle('open');menu.classList.toggle('open');});}

  var els=document.querySelectorAll('.rv');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(en){en.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:.12});
    els.forEach(function(el){io.observe(el);});
  }else{els.forEach(function(el){el.classList.add('in');});}

  var counters=document.querySelectorAll('[data-count]');
  var co=new IntersectionObserver(function(en){en.forEach(function(e){
    if(!e.isIntersecting)return;co.unobserve(e.target);
    var el=e.target,end=parseInt(el.dataset.count,10),t0=null,suf=el.dataset.suffix||'';
    function tick(t){if(!t0)t0=t;var p=Math.min((t-t0)/1600,1);el.textContent=Math.floor(end*(1-Math.pow(1-p,3)))+suf;if(p<1)requestAnimationFrame(tick);}
    requestAnimationFrame(tick);
  });},{threshold:.5});
  counters.forEach(function(c){co.observe(c);});

  /* multi step apply form */
  var steps=document.querySelectorAll('.step');
  if(steps.length){
    var idx=0,bars=document.querySelectorAll('.progress i');
    var show=function(i){steps.forEach(function(s,n){s.classList.toggle('show',n===i);});bars.forEach(function(b,n){b.classList.toggle('on',n<=i);});
      var top=document.querySelector('.form-card');if(top)window.scrollTo({top:top.offsetTop+60,behavior:'smooth'});};
    document.querySelectorAll('[data-next]').forEach(function(b){b.addEventListener('click',function(){
      var ok=true;steps[idx].querySelectorAll('input,select,textarea').forEach(function(f){if(!f.checkValidity()){f.reportValidity();ok=false;}});
      if(ok&&idx<steps.length-1){idx++;show(idx);}});});
    document.querySelectorAll('[data-prev]').forEach(function(b){b.addEventListener('click',function(){if(idx>0){idx--;show(idx);}});});
    show(0);
  }

  /* formspree ajax */
  document.querySelectorAll('form[data-formspree]').forEach(function(form){
    form.addEventListener('submit',function(e){
      e.preventDefault();
      var btn=form.querySelector('[type=submit]'),err=form.parentNode.querySelector('.err'),orig=btn.textContent;
      btn.disabled=true;btn.textContent='Sending...';if(err)err.style.display='none';
      fetch(form.action,{method:'POST',body:new FormData(form),headers:{'Accept':'application/json'}})
      .then(function(r){
        if(r.ok){form.style.display='none';var p=form.parentNode;var pr=p.querySelector('.progress');if(pr)pr.style.display='none';
          var t=p.querySelector('.thanks');if(t)t.style.display='block';t&&t.scrollIntoView({behavior:'smooth',block:'center'});}
        else{throw new Error('fail');}
      }).catch(function(){btn.disabled=false;btn.textContent=orig;if(err)err.style.display='block';});
    });
  });
})();