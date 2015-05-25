window.addEventListener("load", function() { //La evenimentul de incarcare al paginii
	var divVideo = document.createElement("div"); //Imi creez un tag div 
	var video = document.createElement("video"); //Imi creez un element video
	document.body.appendChild(divVideo); //Adaug div-ul creat la tagul body al paginii
	divVideo.appendChild(video); //Adaug video-ul creat la div
	var canvas = document.getElementById("video-player"); //Imi obtin regiunea canvas
	var context = canvas.getContext("2d"); //Obtin contextul 2d din canvas
	
	video.setAttribute("src", "media/video3.mp4"); //Setez sursa videoclipului 
	var idVideo = 3; //Setez id-ul videoclipuli (sa stiu la care sa ma refer la autoplay si la next, previous)
	var idEfect = 0; //Setez id-ul efectului care ruleaza (sa stiu sa ma refer la apasarea pe butoanele de efecte)
	var autoplay = false; //Setez implicit ca autoplay-ul sa nu fie activ 
	
	var videoclipuri = []; //Definesc array-ul in care voi retine continutul fisierului json
	$.getJSON('media/subtitrari.json', function(v) { //Folosesc jQuery ca sa pot extrage continutul fisierului json de subtitrari
		videoclipuri = v; //Incarc array-ul local de subtitrari
	});

	deseneazaVideoPlayer(); //Pana sa se incarce videoclipul apelez functia care deseneaza playerul

	video.addEventListener("canplay", function() { //La evenimentul in care se poate reda clipul (adica s-a incarcat)
		canvas.width = 600 + 14; //Setez latimea canvasului; 600-zona video; 14-bordura stanga-dreapta
		canvas.height = 340 + 50; //Setez inaltimea canvasului; 340-zona video; 50-zona de desenare a controalelor
		divVideo.setAttribute("style", "display:none;"); //Ascund div-ul ce contine videoclipul; el va fi accesibil in continuare
		deseneazaVideoPlayer(); //Apelez functia de desenare player
	});

	var interval = null; //Definesc un interval pt a desena playerul la fiecare 20 milisecunde la
	video.addEventListener("play", function() { //evenimentul de play
		var interval = window.setInterval(deseneazaVideoPlayer, 20);
	});

	video.addEventListener("pause", function() { //La evenimentul de pauza 
		window.clearInterval(interval); //resetez intervaulul
	});

	video.addEventListener("ended", function() { //La evenimentul de terminare a videoclipului
		window.clearInterval(interval); //resetez intervaulul
	});

	//Desenare elemente video player pe canvas-----------------------------------------------------------------------------------------
	function deseneazaVideoPlayer() {
		//Fundal canvas---------------------------------------------------------------
		context.fillStyle = '#000'; //Setez culoarea de umplere cu negru
		context.fillRect(0, 0, canvas.width, canvas.height); //Desenez un dreptunghi
		//Container/bordura canvas----------------------------------------------------
		context.strokeStyle = '#fff'; //Setez culoarea bordurii cu alb
		context.strokeRect(5, 5, canvas.width - 10, canvas.height - 10);
		//Cadru video-----------------------------------------------------------------
		//In functie de id-ul efectului 
		if (idEfect == 0) {//Desenez imaginea normala pe care o preluam din videoclip
			context.drawImage(video, 7, 7, 600, 340);
		}
		else if (idEfect == 1) {//Aplic efectul de gri
			gri();
		}
		else if (idEfect == 2) {//Aplic efectul sepia
			sepia();
		}
		else if (idEfect == 3) {//Aplic efectul rosu
			rosu();
		}
		else if (idEfect == 4) {//Aplic efectul de inversare a culorilor
			inverseaza();
		}
		//Desenare gradient player------------------------------------------------------------
		//Creez un gradient liniar in zona in care vor fi plasate controalele, in partea de jos
		var gradient = context.createLinearGradient(0, 200, 0, 600);
		gradient.addColorStop(0, "white"); //Culoarea de start de sus
		gradient.addColorStop(0.5, "black"); //Culoarea de mijloc
		gradient.addColorStop(1, "white"); //Culoarea de stop de jos
		context.fillStyle = gradient; //Atasez gradientul ca si culoare de umplere
		context.fillRect(7, 348, 600, 35); //Umplu gradientul atasat in zona de dreptunghi
		//Desenare controale------------------------------------------------------------------
		//Previous----------------------------------------------------------------------------
		cerc(35, 366, 15, "#868686"); 
		sageataStanga(25, 355, 32, 23, "#282828"); //Desenez sageata stanga a butonului previous
		//Play--------------------------------------------------------------------------------
		cerc(80, 366, 15, "#868686"); //Desenez cercul butonului play
		if (video.paused) {//Daca videoclipul e setat pe pauza atunci afisam sageata de redare(spre dreapta)
			sageataDreapta(59, 355, 32, 23, "#194719"); //Sageata dreapta 
			//Fundal zona video---------------------------------------------------------
			//Cand vide-ul este pe pause punem o culare de gri pe zona video si un buton de play
			context.beginPath(); //Incep/resetez o zona pt desena pe canvas
			context.rect(7, 7, 600, 340); //Creez un dreptunghi cat zona video
			context.fillStyle = "rgba(0, 0, 0, 0.5)"; //Setez o culoare transparenta de umplere
			context.fill(); //Umplu regiunea 
			cerc(307, 195, 30, "rgba(199, 199, 198, 0.5)"); //Creez cercul butonului ce va aparea in mijlocul zonei video
			sageataDreapta(262, 173, 67, 45, "rgba(0, 0, 0, 0.5)"); //In el pun sageata dreapta / de play
			context.closePath();
		}
		else {//Altfel daca filmul ruleaza atunci afisam simbolul de pauza, 
			//doua bare laterale
			bara(67, 356, 36, 19);
			bara(75, 356, 36, 19);
		}
		//Next--------------------------------------------------------------------------------
		cerc(580, 366, 15, "#868686"); //Desenez cercul butonului next
		sageataDreapta(558, 355, 32, 23, "#282828"); //Desenez sageata dreapta a butonului next
		//Progress bar-------------------------------------------------------------------------
		context.beginPath(); //Incep/resetez o zona pt desena pe canvas
		context.rect(113, 357, 437, 20); //Desenez un dreptungi in partea de jos intre 
		//butoanele de play/pause si next
		context.fillStyle = "#868686"; //Setez culoare de umplere
		context.fill(); //Umplu regiunea
		context.lineWidth = 0.6; //Setez grosimea bordurii
		context.strokeStyle = 'black'; //Setez culoarea bordurii
		context.stroke(); //Aplic bordura
		context.closePath();
		//Setez un intervar pentru a executa functia de desenare progress bar la 20 milisecunde
		var interval2 = window.setInterval(progress(), 20);
		//video.addEventListener("timeupdate", progress()); //As fi putut sa folosesc si evenimentul timeupdate
		//Functia care va fi apelata pt desenarea dinamica a progress bar-ului
		function progress() {
			//Calculez cat la suta s-a scurs din video raportat la durata si impart la 100
			var procent = Math.floor((100 / video.duration) * video.currentTime) / 100;
			context.beginPath(); //Incep/resetez o zona pt desena pe canvas
			context.fillStyle = "#999999"; //Setez culoarea de umplere
			context.fillRect(113, 357, 437 * procent, 20); //Creez un dreptunghi la x=113 si y=357, 
			//de latime cat s-a scurs ori latimea pe care trebuie s-o aiba si inaltime 20 
			context.closePath();
		}
		window.clearInterval(interval2); //Resetez intervalul 

		//Subtitrare-------------------------------------------------------------------------------
		for (var i = 0; i < videoclipuri.length; i++) { //Parcurg array-ul aflat in fisierul json
			if (videoclipuri[i].id == idVideo) { //Daca id-ul videoclipului corespunde cu id-ul clipului care ruleaza
				//Imi obtin subtitrarea de la pozitia i din colectia de clipuri (pentru a ma referi mai usor)
				var s = videoclipuri[i].subtitrare;
				for (var j = 0; j < s.length; j++) { //Parcurg subtitrarea clipului curent
					//Compar partea intreaga din secunda videoclipului care ruleaza, altfel ar trebui sa compar cu valori cu multe zecimale
					//cu secunda definita in colectia de subtitrari de la pozitia j
					if (s[j].sec1 <= video.currentTime && video.currentTime <= s[j].sec2) {
						context.beginPath(); //Incep/resetez o zona pt desena pe canvas
						context.fillStyle = "white"; //Setez culoarea de umplere
						context.strokeStyle = "black"; //Setez culoarea bordurii
						context.lineWidth = 0.2; //Setez grosimea bordurii
						context.font = "30px Georgia"; //Setez fontul (+dimensiunea) 
						context.textAlign = "center"; //Setez aliniamentul textului
						//Setez unde apara textul si bordura subtitrarii (pe care il iau din colectie de la pozitia j)
						//La x=307 (mijlocul zonei canvas), y=330 in partea de jos a zonei video, 400=latimea maxima admisa a textului
						context.fillText(s[j].text, 307, 330, 400); //textul
						context.strokeText(s[j].text, 307, 330, 400); //bordura
						context.closePath();
					}
				}
			}
		}
	}

	//Functie pt desenare cerc 
	function cerc(x, y, r, culoare) {
		context.beginPath(); //Incep/resetez o zona pt desena pe canvas
		context.arc(x, y, r, 0, 2 * Math.PI, false); //Desenez un cerc
		context.fillStyle = culoare; //Setez culoarea de umplere
		context.fill(); //Umplu regiunea
		context.lineWidth = 0.6; //Latimea bordurii
		context.strokeStyle = "black"; //Culoarea bordurii
		context.stroke(); //Aplic bordura
		context.closePath();
	}

	//Functie pt desenare sageata stanga
	function sageataStanga(x, y, w, h, culoare) {
		context.beginPath(); //Incep/resetez o zona pt desena pe canvas
		context.fillStyle = culoare; //Setez culoarea de umplere
		//Ma plasez la x si y si trasez o line
		context.moveTo(w * 0 / 6 + x, h * 3 / 6 + y);
		//Trasez linii in functie de x, y, w, h
		context.lineTo(w * 1 / 6 + x, h * 2 / 6 + y);
		context.lineTo(w * 2 / 6 + x, h * 1 / 6 + y);
		context.lineTo(w * 3 / 6 + x, h * 0 / 6 + y);
		context.lineTo(w * 3 / 6 + x, h * 1 / 6 + y);
		context.lineTo(w * 3 / 6 + x, h * 2 / 6 + y);
		context.lineTo(w * 3 / 6 + x, h * 3 / 6 + y);
		context.lineTo(w * 3 / 6 + x, h * 4 / 6 + y);
		context.lineTo(w * 3 / 6 + x, h * 5 / 6 + y);
		context.lineTo(w * 3 / 6 + x, h * 6 / 6 + y);
		context.lineTo(w * 1 / 6 + x, h * 4 / 6 + y);
		context.lineTo(w * 2 / 6 + x, h * 5 / 6 + y);
		context.lineTo(w * 0 / 6 + x, h * 3 / 6 + y);
		context.fill(); //Umplu regiunea cu culoarea primita
		context.closePath();
	}
	
	//Functie pt desenare sageata dreapta
	function sageataDreapta(x, y, w, h, culoare) {
		context.beginPath(); //Incep/resetez o zona pt desena pe canvas
		context.fillStyle = culoare; //Setez culoarea de umplere
		//Ma plasez la x si y si trasez o line
		context.moveTo(w * 6 / 6 + x, h * 3 / 6 + y);
		//Trasez linii in functie de x, y, w, h
		context.lineTo(w * 5 / 6 + x, h * 2 / 6 + y);
		context.lineTo(w * 4 / 6 + x, h * 1 / 6 + y);
		context.lineTo(w * 3 / 6 + x, h * 0 / 6 + y);
		context.lineTo(w * 3 / 6 + x, h * 1 / 6 + y);
		context.lineTo(w * 3 / 6 + x, h * 2 / 6 + y);
		context.lineTo(w * 3 / 6 + x, h * 3 / 6 + y);
		context.lineTo(w * 3 / 6 + x, h * 4 / 6 + y);
		context.lineTo(w * 3 / 6 + x, h * 5 / 6 + y);
		context.lineTo(w * 3 / 6 + x, h * 6 / 6 + y);
		context.lineTo(w * 4 / 6 + x, h * 5 / 6 + y);
		context.lineTo(w * 5 / 6 + x, h * 4 / 6 + y);
		context.lineTo(w * 6 / 6 + x, h * 3 / 6 + y);
		context.fill(); //Umplu regiunea cu culoarea primita
		context.closePath();
	}
	
	//Functie pt desenare bara verticala
	function bara(x, y, w, h) {
		context.beginPath(); //Incep/resetez o zona pt desena pe canvas
		context.fillStyle = "#282828"; //Setez culoarea de umplere
		//Ma plasez la x si y si trasez o line
		context.moveTo(w * 1 / 6 + x, h * 0 / 6 + y);
		//Trasez linii in functie de x, y, w, h
		context.lineTo(w * 2 / 6 + x, h * 0 / 6 + y);
		context.lineTo(w * 2 / 6 + x, h * 1 / 6 + y);
		context.lineTo(w * 2 / 6 + x, h * 2 / 6 + y);
		context.lineTo(w * 2 / 6 + x, h * 3 / 6 + y);
		context.lineTo(w * 2 / 6 + x, h * 4 / 6 + y);
		context.lineTo(w * 2 / 6 + x, h * 5 / 6 + y);
		context.lineTo(w * 2 / 6 + x, h * 6 / 6 + y);
		context.lineTo(w * 1 / 6 + x, h * 6 / 6 + y);
		context.lineTo(w * 1 / 6 + x, h * 5 / 6 + y);
		context.lineTo(w * 1 / 6 + x, h * 4 / 6 + y);
		context.lineTo(w * 1 / 6 + x, h * 3 / 6 + y);
		context.lineTo(w * 1 / 6 + x, h * 2 / 6 + y);
		context.lineTo(w * 1 / 6 + x, h * 1 / 6 + y);
		context.lineTo(w * 1 / 6 + x, h * 0 / 6 + y);
		context.fill(); //Umplu regiunea cu culoarea primita
		context.closePath();
	}

	//La evenimentul de mouse apasat pe canvas
	canvas.addEventListener("mousedown", function(e) {
		var x = e.pageX - canvas.offsetLeft; //Obtin coordonata x la care s-a apasat pe canvas
		var y = e.pageY - canvas.offsetTop; //Obtin coordonata y la care s-a apasat pe canvas
		//Verific daca zona apasata se afla in zona butonului previous
		if (x >= 20 && x <= 50 && y >= 350 && y <= 380) {//Daca da, atunci
			//in functie de id-ul videoclipului:
			//setez titlul cu cel al videoclipului care o sa ruleze (cel anterior)
			//setez sursa videoclipului cu cel care o sa ruleze
			//setez id-ul corespunzator cu cel anterior care o sa ruleze
			if (idVideo == 1) {
				document.getElementById("titlu-video").innerHTML = "Caveman";
				video.setAttribute("src", "media/video5.mp4");
				idVideo = 5;
			}
			else if (idVideo == 2) {
				document.getElementById("titlu-video").innerHTML = "The final straw";
				video.setAttribute("src", "media/video1.mp4");
				idVideo = 1;
			}
			else if (idVideo == 3) {
				document.getElementById("titlu-video").innerHTML = "Lama";
				video.setAttribute("src", "media/video2.mp4");
				idVideo = 2;
			}
			else if (idVideo == 4) {
				document.getElementById("titlu-video").innerHTML = "Peck pocketed";
				video.setAttribute("src", "media/video3.mp4");
				idVideo = 3;
			}
			else if (idVideo == 5) {
				document.getElementById("titlu-video").innerHTML = "Rupert & sam";
				video.setAttribute("src", "media/video4.mp4");
				idVideo = 4;
			}
			video.play(); //Dupa ce s-a apasat, rulez videoclipul caruia i-au fost setate caracteristicile
		} //Verific daca zona apasata se afla in zona butonului play/pause
		else if (x >= 65 && x <= 95 && y >= 350 && y <= 380) {
			if (video.paused) { //Daca videoclipul este setat pe pauza
				video.play(); //Rulez videoclipul
			}
			else {//Altfel daca ruleaza il setez pe pauza
				video.pause();
			}
		} //Verific daca zona apasata se afla in zona butonului next
		else if (x >= 565 && x <= 595 && y >= 350 && y <= 380) { //Daca da, atunci
			//in functie de id-ul videoclipului:
			//setez titlul cu cel al videoclipului care o sa ruleze (cel urmator)
			//setez sursa videoclipului cu cel care o sa ruleze
			//setez id-ul corespunzator cu cel anterior care o sa ruleze
			if (idVideo == 1) {
				document.getElementById("titlu-video").innerHTML = "Lama";
				video.setAttribute("src", "media/video2.mp4");
				idVideo = 2;
			}
			else if (idVideo == 2) {
				document.getElementById("titlu-video").innerHTML = "Peck pocketed";
				video.setAttribute("src", "media/video3.mp4");
				idVideo = 3;
			}
			else if (idVideo == 3) {
				document.getElementById("titlu-video").innerHTML = "Rupert & sam";
				video.setAttribute("src", "media/video4.mp4");
				idVideo = 4;
			}
			else if (idVideo == 4) {
				document.getElementById("titlu-video").innerHTML = "Caveman";
				video.setAttribute("src", "media/video5.mp4");
				idVideo = 5;
			}
			else if (idVideo == 5) {
				document.getElementById("titlu-video").innerHTML = "The final straw";
				video.setAttribute("src", "media/video1.mp4");
				idVideo = 1;
			}
			video.play(); //Dupa ce s-a apasat, rulez videoclipul caruia i-au fost setate caracteristicile
		} //Verific daca zona apasata se afla in zona butonului din mijloc
		else if (x >= 275 && x <= 335 && y >= 160 && y <= 220) {
			if (video.paused) { //Daca e setat pe pauza
				video.play(); //Rulez videoclipul
			}
			else { //Altfel daca ruleaza il setez pe pauza
				video.pause();
			}
		} //Verific daca zona apasata se afla in zona progress-bar-ului
		else if (x >= 113 && x <= 550 && y >= 357 && y <= 377) { //Daca da, atunci 
			//Setez secunda curenta a videoclipului care ruleaza cu
			//procentul reprezentat de x din intervalul 113 - 437 apasat ori durata videoclipului   
			video.currentTime = video.duration * (x - 113) / 437;
		} //Altfel daca zona apasata nu  corespunde cu ce s-a verificat, setez pe pauza
		else {
			video.pause();
		}
	});

	//Playlist------------------------------------------------------------------------------------------------
	var playlist = document.getElementById("playlist"); //Obtin elementul lista
	//Obtin ficare list item din lista
	var li1 = playlist.getElementsByTagName("li")[0];
	var li2 = playlist.getElementsByTagName("li")[1];
	var li3 = playlist.getElementsByTagName("li")[2];
	var li4 = playlist.getElementsByTagName("li")[3];
	var li5 = playlist.getElementsByTagName("li")[4];
	//Atasez ascultator la evenimetul click pe fiecare din list itemi
	//Pentru fiecare list item 
	//setez titlul cu cel al videoclipului care o sa ruleze (cel selectat
	//setez sursa videoclipului cu cel care o sa ruleze
	//setez id-ul clipului care o sa ruleze
	//apoi rulez videoclipul
	li1.addEventListener("click", function() {
		document.getElementById("titlu-video").innerHTML = "The final straw";
		video.setAttribute("src", "media/video1.mp4");
		idVideo = 1;
		video.play();
	});
	li2.addEventListener("click", function() {
		document.getElementById("titlu-video").innerHTML = "Lama";
		video.setAttribute("src", "media/video2.mp4");
		idVideo = 2;
		video.play();
	});
	li3.addEventListener("click", function() {
		document.getElementById("titlu-video").innerHTML = "Peck pocketed";
		video.setAttribute("src", "media/video3.mp4");
		idVideo = 3;
		video.play();
	});
	li4.addEventListener("click", function() {
		document.getElementById("titlu-video").innerHTML = "Rupert & sam";
		video.setAttribute("src", "media/video4.mp4");
		idVideo = 4;
		video.play();
	});
	li5.addEventListener("click", function() {
		document.getElementById("titlu-video").innerHTML = "Caveman";
		video.setAttribute("src", "media/video5.mp4");
		idVideo = 5;
		video.play();
	});
	//Autoplay-------------------------------------------------------------------------------
	var btnAutoplay = document.getElementById("autoplay"); //Imi obtin elementul 
	btnAutoplay.addEventListener("click", function() { //La evenimentul de click
		if (autoplay == false) { //Daca este setat contextul de autoplay
			btnAutoplay.style.color = "red"; //Setez culoarea sa fie rosie
			btnAutoplay.innerHTML = "Autoplay : Pornit"; //Textul din interior
			autoplay = true; 
		}
		else { //Daca nu este setat contextul de autoplay
			btnAutoplay.style.color = "#232323"; //Setez culoarea
			btnAutoplay.innerHTML = "Autoplay : Oprit"; //Textul din interior
			autoplay = false;
		}
	});
	//La evenimentul de terminare a videoclipului
	video.addEventListener("ended", function() {
		if (autoplay) { //Daca este setat contextul de autoplay pe true
			//in functie de id-ul videoclipului:
			//setez titlul cu cel al videoclipului care o sa ruleze (cel urmator)
			//setez sursa videoclipului cu cel care o sa ruleze
			//setez id-ul corespunzator cu cel anterior care o sa ruleze
			if (idVideo == 1) {
				document.getElementById("titlu-video").innerHTML = "Lama";
				video.setAttribute("src", "media/video2.mp4");
				idVideo = 2;
			}
			else if (idVideo == 2) {
				document.getElementById("titlu-video").innerHTML = "Peck pocketed";
				video.setAttribute("src", "media/video3.mp4");
				idVideo = 3;
			}
			else if (idVideo == 3) {
				document.getElementById("titlu-video").innerHTML = "Rupert & sam";
				video.setAttribute("src", "media/video4.mp4");
				idVideo = 4;
			}
			else if (idVideo == 4) {
				document.getElementById("titlu-video").innerHTML = "Caveman";
				video.setAttribute("src", "media/video5.mp4");
				idVideo = 5;
			}
			else if (idVideo == 5) {
				document.getElementById("titlu-video").innerHTML = "The final straw";
				video.setAttribute("src", "media/video1.mp4");
				idVideo = 1;
			}
			video.play(); //Dupa ce s-a apasat, rulez videoclipul caruia i-au fost setate caracteristicile
		}
	});

	//Salvare cadru curent-----------------------------------------------------
	var btnSalvare = document.getElementById("cadruVideo"); //Imi obtin tagul html dupa id-ul dat
	btnSalvare.addEventListener("click", function() { //Atasez ascultator pe butonul obtinut la evenimentul de click
		var canvasNou = document.createElement("canvas"); //Creez un nou canvas
		var contextNou = canvasNou.getContext("2d"); //Imi obtin contextul 2d din canvas 
		contextNou.canvas.width = 1024; //Setez latimea canvasului
		contextNou.canvas.height = 620; //Setez inaltimea canvasului
		contextNou.drawImage(video, 0, 0); //Desenez imaginea pe canvas pe care o obtin din videoclipul care ruleaza la coordonata (0, 0)
		var cadruVideo = new Image(); //Creez o noua imagine in care sa retin cadrul video curent
		cadruVideo.src = canvasNou.toDataURL("image/png"); //Setez atributul src (resursa pozei) cu imaginea obtinuta de pe canvasul creat
		btnSalvare.href = cadruVideo.src; //Setez destinatia link-uli la apasarea pe ancora (care include un buton) cu adresa/sursa imaginii create mai sus
	});

	function creareImagineDinVideo() {
		var canvasNou = document.createElement("canvas");
		var contextNou = canvasNou.getContext("2d");
		canvasNou.width = video.width = 614;
		canvasNou.height = video.height = 390;

		contextNou.drawImage(video, 0, 0);
		var imageData = contextNou.getImageData(0, 0, canvasNou.width, canvasNou.height);
		return imageData;
	}

	//Aplicare de efecte video
	function gri() {
		var pixeli = creareImagineDinVideo();
		var data = pixeli.data;
		for (var i = 0; i < data.length; i += 4) {
			var r = data[i];
			var g = data[i + 1];
			var b = data[i + 2];
			data[i] = data[i + 1] = data[i + 2] = (r + g + b) / 3;
		}
		context.putImageData(pixeli, 7, 7, 0, 0, 600, 340);
	}

	function sepia() {
		var pixeli = creareImagineDinVideo();
		var data = pixeli.data;
		for (var i = 0; i < data.length; i += 4) {
			var r = data[i];
			var g = data[i + 1];
			var b = data[i + 2];
			data[i] = (r * 0.393) + (g * 0.769) + (b * 0.189);
			data[i + 1] = (r * 0.349) + (g * 0.686) + (b * 0.168);
			data[i + 2] = (r * 0.272) + (g * 0.534) + (b * 0.131);
		}
		context.putImageData(pixeli, 7, 7, 0, 0, 600, 340);
	};

	function rosu() {
		var pixeli = creareImagineDinVideo();
		var data = pixeli.data;
		for (var i = 0; i < data.length; i += 4) {
			var r = data[i];
			var g = data[i + 1];
			var b = data[i + 2];
			data[i] = (r + g + b) / 3; 
			data[i + 1] = data[i + 2] = 0;
		}
		context.putImageData(pixeli, 7, 7, 0, 0, 600, 340);
	}

	function inverseaza() {
		var pixeli = creareImagineDinVideo();
		var data = pixeli.data;
		for (var i = 0; i < data.length; i += 4) {
			data[i] = 255 - data[i];
			data[i + 1] = 255 - data[i + 1];
			data[i + 2] = 255 - data[i + 2];
		}
		context.putImageData(pixeli, 7, 7, 0, 0, 600, 340);
	}

	var btnNormal = document.getElementById("normal");
	btnNormal.addEventListener("click", function() {
		idEfect = 0;
	});

	var btnGri = document.getElementById("gri");
	btnGri.addEventListener("click", function() {
		idEfect = 1;
	});

	var btnSepia = document.getElementById("sepia");
	btnSepia.addEventListener("click", function() {
		idEfect = 2;
	});

	var btnRosu = document.getElementById("rosu");
	btnRosu.addEventListener("click", function() {
		idEfect = 3;
	});

	var btnInverseaza = document.getElementById("inverseaza");
	btnInverseaza.addEventListener("click", function() {
		idEfect = 4;
	});

});
