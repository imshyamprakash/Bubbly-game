let timer=60;
let score=0;
let hitsc;

function hitscore(){
    score+=10;
    document.getElementById('sc').innerText=score;
}

function change(){
    hitsc=Math.floor(Math.random()*10);
    document.querySelector("#hit").innerText=hitsc;
}

function makebubble(){
    let cluster=""
    for(let i=1;i<=160;i++){
        let rn=Math.floor(Math.random()*10);
        cluster+=`<div class="bubble">${rn}</div>`
    }
    document.querySelector("#sub3").innerHTML=cluster;

}

function time(){
    const timeint=setInterval(function(){
        if (timer>0){
            timer--;
            document.getElementById("val").innerText=timer
        }
        else{
            clearInterval(timeint);
            document.getElementById("sub3").innerHTML="<h1>Game Over</h1>";
        }
    },1000)
}

function play(){
    const ele=document.getElementById("sub3");
    ele.addEventListener("click",function(e){
        let num=Number(e.target.innerText);
        if (num==hitsc){
            hitscore();
            makebubble();
            change();
        }
    })
}


document.querySelector("#hit").innerText=hitsc;


makebubble();
time();
change();
play();

