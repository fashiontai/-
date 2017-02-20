function startmarquee(lh,speed,delay){ 
			var t; 
			var p=false; 
			var o=document.getElementById("marquee"); 
			o.innerHTML+=o.innerHTML; 
			o.onmouseover=function(){p=true} 
			o.onmouseout=function(){p=false} 
			o.scrollTop = 0; 
			function start(){ 
				t=setInterval(scrolling,speed); 
				if(!p){ o.scrollTop += 1;} 
			} 
			function scrolling(){ 
				if(o.scrollTop%lh!=0){ 
					o.scrollTop += 1; 
					if(o.scrollTop>=o.scrollHeight/2) o.scrollTop = 0; 
				}else{ 
					clearInterval(t); 
					setTimeout(start,delay); 
				} 
			} 
			setTimeout(start,delay); 
		} 