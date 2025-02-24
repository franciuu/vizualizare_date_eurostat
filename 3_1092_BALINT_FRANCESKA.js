async function aplicatie() {
  const tari = [
    "BE",
    "BG",
    "CZ",
    "DK",
    "DE",
    "EE",
    "IE",
    "EL",
    "ES",
    "FR",
    "HR",
    "IT",
    "CY",
    "LV",
    "LT",
    "LU",
    "HU",
    "MT",
    "NL",
    "AT",
    "PL",
    "PT",
    "RO",
    "SI",
    "SK",
    "FI",
    "SE",
  ];
  const ani = [
    2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020,
    2021, 2022, 2023,
  ];
  const indicatori = ["PIB", "SV", "POP"];
  let date = [];
  let minPIBGlobal, maxPIBGlobal;
  let minSVGlobal, maxSVGlobal;
  let maxPopGlobal;

  await initializareDate();
  populareSelect();
  calculExtreme();

  const bubbleBtn = document.querySelector(".bubble");
  bubbleBtn.addEventListener("click", bubbleChartPentruUnAn);
  const tabelBtn = document.querySelector(".tabel");
  tabelBtn.addEventListener("click", afisareTabel);
  const animatieBtn = document.querySelector(".animatie");
  animatieBtn.addEventListener("click", bubbleChartPentruTotiAnii);
  const histogramaBtn = document.querySelector(".histograma");
  histogramaBtn.addEventListener("click", afisareHistograma);

  //pentru SV, POP și PIB, funcția apelează "fetchData" pentru a descărca și prelucra datele. rezultatele obținute sunt adăugate într-un vector global "date"
  async function initializareDate() {
    const datasets = [
      { cheie: "SV", setDate: "demo_mlexpec?sex=T&age=Y1" },
      { cheie: "POP", setDate: "demo_pjan?sex=T&age=TOTAL" },
      { cheie: "PIB", setDate: "sdg_08_10?na_item=B1GQ&unit=CLV10_EUR_HAB" },
    ];

    for (const dataset of datasets) {
      const fetchedData = await fetchData(dataset.setDate, dataset.cheie);
      date.push(...fetchedData);
    }
    console.log(date);
  }
  //dacă rezultatul este valid, se parsează datele în format JSON. mă asigur că datele sunt disponibile și apoi extrag informațiile necesare
  //for exterior - țările, for interior - anii, valorile din dateJson.value sunt indexate liniar, deci valoarea pt o țară și un an este la poziția i * y.length + j
  async function fetchData(setDate, indicator) {
    const parteFixa =
      "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/";
    const url = `${parteFixa}${setDate}&lastTimePeriod=15&geo=${tari.join(
      "&geo="
    )}`;

    const rezultat = await fetch(url);
    if (!rezultat.ok) {
      throw new Error(`API request failed - Status: ${rezultat.status}`);
    }
    const dateJson = await rezultat.json();
    console.log(dateJson);
    const dateProcesate = [];

    if (
      dateJson.dimension &&
      dateJson.dimension.geo &&
      dateJson.dimension.time
    ) {
      const c = Object.keys(dateJson.dimension.geo.category.index);
      const y = Object.keys(dateJson.dimension.time.category.label);
      const v = dateJson.value;

      for (let i = 0; i < c.length; ++i) {
        const tara = c[i];
        for (let j = 0; j < y.length; ++j) {
          const an = y[j];
          const val = v[i * y.length + j];

          if (val !== undefined) {
            dateProcesate.push({
              tara: tara,
              an: an,
              indicator: indicator,
              valoare: val,
            });
          }
        }
      }
    }
    return dateProcesate;
  }
  //populez combobox-urile cu țările, indicatorii și anii disponibili
  function populareSelect() {
    const selectCountry = document.querySelector("#selectCountry");
    for (let tara of tari) {
      const option = document.createElement("option");
      option.value = tara;
      option.text = tara;
      selectCountry.appendChild(option);
    }

    const selectIndicator = document.querySelector("#selectIndicator");
    for (let ind of indicatori) {
      const option = document.createElement("option");
      option.value = ind;
      option.text = ind;
      selectIndicator.appendChild(option);
    }

    const selectYear = document.querySelector("#selectYear");
    for (let an of ani) {
      const option = document.createElement("option");
      option.value = an;
      option.text = an;
      selectYear.appendChild(option);
    }
  }
  //calculez valorile extreme pentru a mă ajuta la reprezentarea bubble chart-ului
  function calculExtreme() {
    maxPopGlobal = Math.max(
      ...date.filter((d) => d.indicator === "POP").map((d) => d.valoare)
    );
    minPIBGlobal = Math.min(
      ...date.filter((d) => d.indicator === "PIB").map((d) => d.valoare)
    );
    maxPIBGlobal = Math.max(
      ...date.filter((d) => d.indicator === "PIB").map((d) => d.valoare)
    );
    minSVGlobal = Math.min(
      ...date.filter((d) => d.indicator === "SV").map((d) => d.valoare)
    );
    maxSVGlobal = Math.max(
      ...date.filter((d) => d.indicator === "SV").map((d) => d.valoare)
    );
  }
  //afișare grafică evoluție pentru un indicator și o țară selectată - SVG
  //adaug axele, etichetele axelor și desenez barele
  function afisareHistograma() {
    const tara = document.querySelector("#selectCountry").value;
    const indicator = document.querySelector("#selectIndicator").value;
    const dateTaraIndicator = date.filter(
      (x) => x.tara === tara && x.indicator === indicator
    );

    const svgElement = document.querySelector("svg");
    const rect = svgElement.getBoundingClientRect();
    svgElement.innerHTML = "";
    const svgWidth = rect.width; 
    const svgHeight = rect.height; 
    const margine = 50;
    const valMax = Math.max(...dateTaraIndicator.map((x) => x.valoare));

    //lățimea disponibilă pe axa X este împărțită egal între toate elementele
    //înălțimea barelor este proporțională cu valorile lor raportate la valMax
    const scalaX = (svgWidth - 2 * margine) / dateTaraIndicator.length;
    const scalaY = (svgHeight - 2 * margine) / valMax;

    const axaX = document.createElementNS("http://www.w3.org/2000/svg", "line");
    axaX.setAttribute("x1", margine);
    axaX.setAttribute("y1", svgHeight - margine);
    axaX.setAttribute("x2", svgWidth - margine);
    axaX.setAttribute("y2", svgHeight - margine);
    axaX.setAttribute("stroke", "white");
    svgElement.appendChild(axaX);

    const axaY = document.createElementNS("http://www.w3.org/2000/svg", "line");
    axaY.setAttribute("x1", margine);
    axaY.setAttribute("y1", margine);
    axaY.setAttribute("x2", margine);
    axaY.setAttribute("y2", svgHeight - margine);
    axaY.setAttribute("stroke", "white");
    svgElement.appendChild(axaY);

    //scalaX / 2 pentru a centra etichetele
    //etichete sub grafic, cu un offset de 20
    for (let i = 0; i < dateTaraIndicator.length; i++) {
      const d = dateTaraIndicator[i];
      const labelX = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text"
      );
      labelX.textContent = d.an;
      labelX.setAttribute("x", margine + i * scalaX + scalaX / 2);
      labelX.setAttribute("y", svgHeight - margine + 20);
      labelX.setAttribute("text-anchor", "middle");
      labelX.setAttribute("font-size", "12px");
      labelX.setAttribute("stroke", "white");
      svgElement.appendChild(labelX);
    }

    //poziționare în stanga axei Y, cu un offset de 10
    for (let i = 0; i <= 5; i++) {
      const value = (valMax / 5) * i;
      const pozY = svgHeight - margine - value * scalaY;

      const labelY = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text"
      );
      labelY.textContent = Math.round(value);
      labelY.setAttribute("x", margine - 10);
      labelY.setAttribute("y", pozY);
      labelY.setAttribute("text-anchor", "end");
      labelY.setAttribute("font-size", "12px");
      labelY.setAttribute("stroke", "white");
      svgElement.appendChild(labelY);
    }

    //pun un spațiu de 10 între bare
    for (let i = 0; i < dateTaraIndicator.length; i++) {
      const d = dateTaraIndicator[i];
      const bar = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "rect"
      );
      bar.setAttribute("x", margine + i * scalaX + 5);
      bar.setAttribute("y", svgHeight - margine - d.valoare * scalaY);
      bar.setAttribute("width", scalaX - 10);
      bar.setAttribute("height", d.valoare * scalaY);
      bar.setAttribute("fill", "#e2b6ff");
      svgElement.appendChild(bar);
    }
  }
  //funcție apelată la apăsarea butonului pentru vizualizarea bubble chart-ului pt un an
  function bubbleChartPentruUnAn() {
    const an = document.querySelector("#selectYear").value;
    afisareBubbleChart(an);
  }
  //funcție apelată la apăsarea butonului pentru vizualizarea animației bubble chart
  function bubbleChartPentruTotiAnii() {
    let cnt = 0;
    const interval = setInterval(() => {
      if (cnt < ani.length) {
        const an = ani[cnt];
        afisareBubbleChart(an);
        cnt++;
      } else {
        clearInterval(interval);
      }
    }, 1500);
  }
  //bubble chart pentru un an ca parametru, funcție apelată de "bubbleChartPentruUnAn" și "bubbleChartPentruTotiAnii"
  function afisareBubbleChart(an) {
    const titlu = document.querySelector(".titlu");
    titlu.innerHTML = "Bubble Chart pentru anul " + an;
    const canvas = document.querySelector("canvas");
    const context = canvas.getContext("2d");
    const margine = 70;
    const w = canvas.width;
    const h = canvas.height;
    context.clearRect(0, 0, w, h);

    const dateAn = date.filter((x) => Number(x.an) === Number(an));
    const dateAnMapate = [];
    for (let i = 0; i < tari.length; i++) {
      const tara = tari[i];

      const PIB = dateAn.find((d) => d.tara === tara && d.indicator === "PIB");
      const POP = dateAn.find((d) => d.tara === tara && d.indicator === "POP");
      const SV = dateAn.find((d) => d.tara === tara && d.indicator === "SV");

      if (PIB && POP && SV) {
        dateAnMapate.push({
          tara: tara,
          valoarePIB: PIB.valoare,
          valoarePop: POP.valoare,
          valoareSV: SV.valoare,
        });
      }
    }
    if (dateAnMapate.length === 0) {
      context.font = "30px Arial";
      context.fillStyle = "white";
      context.fillText("Nu există suficiente date disponibile", w / 2, h / 2);
    } else {
      //fiecare valoare PIB va fi transformată proporțional pe axa X, similar SV pe axa Y
      const scalaX = (w - 2 * margine) / (maxPIBGlobal - minPIBGlobal);
      const scalaY = (h - 2 * margine) / (maxSVGlobal - minSVGlobal);

      context.strokeStyle = "white";
      context.beginPath();
      context.moveTo(margine, h - margine); //axa X
      context.lineTo(w - margine, h - margine);
      context.moveTo(margine, h - margine); //axa Y
      context.lineTo(margine, margine);
      context.stroke();

      context.font = "12px Arial";
      context.textAlign = "center";
      context.fillStyle = "white";
      for (let i = 0; i <= 5; i++) {
        const xVal = minPIBGlobal + (i / 5) * (maxPIBGlobal - minPIBGlobal);
        const yVal = minSVGlobal + (i / 5) * (maxSVGlobal - minSVGlobal);

        const xPos = margine + (xVal - minPIBGlobal) * scalaX;
        const yPos = h - margine - (yVal - minSVGlobal) * scalaY;

        context.fillText(xVal.toFixed(0), xPos, h - margine + 15); // Axa X
        context.fillText(yVal.toFixed(1), margine - 25, yPos); // Axa Y
      }
      //pun eticheta PIB la jumatarea axei X, la o distanță de 10 de margina inferioară
      //salvez starea curentă pentru a anula translatarea si rotirea
      //eticheta SV la jumâtatea axei Y, la o distanță de 10 de marginea stângă
      context.fillText("PIB", w / 2, h - 10);
      context.save();
      context.translate(10, h / 2); 
      context.rotate(-Math.PI / 2); //text vertical
      context.fillText("Speranța de viață", 0, 0);
      context.restore();

      //setez dimensiuni între care să se încadreze bula, dimensiunea crește proporțional cu populația
      const raza = (val) => {
        const minRaza = 10;
        const maxRaza = 30;
        const scalaRaza = (maxRaza - minRaza) / maxPopGlobal;
        return Math.min(maxRaza, minRaza + val * scalaRaza);
      };
      for (let obiect of dateAnMapate) {
        const x = margine + (obiect.valoarePIB - minPIBGlobal) * scalaX;
        const y = h - margine - (obiect.valoareSV - minSVGlobal) * scalaY;
        const r = raza(obiect.valoarePop);

        context.beginPath();
        context.arc(x, y, r, 0, 2 * Math.PI);
        context.fillStyle = "rgba(226, 182, 255, 0.5)";
        context.fill();
        context.stroke();

        context.fillStyle = "black";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = "12px Arial";
        context.fillText(obiect.tara, x, y);
      }
    }
  }
  //funcție pentru a calcula culoarea în funcție de valoare
  function setBackground(valori, val, cmin, cmax) {
    let deltaValori = Math.max(...valori) - Math.min(...valori);
    let deltaCulori = cmax - cmin;
    let culoare =
      cmin + ((val - Math.min(...valori)) / deltaValori) * deltaCulori;
    return `hsl(${culoare}, 100%, 70%)`;
  }
  //generez tabelul pentru un an selectat
  //obțin datele pentru anul selectat și le combin pe țări pentru a le afișa în tabel
  function afisareTabel() {
    const table = document.querySelector("table");
    const tbodyElement = document.querySelector("tbody");
    tbodyElement.innerHTML = "";

    const an = document.querySelector("#selectYear").value;
    const titluTabel = document.querySelector(".titluTabel");
    titluTabel.innerHTML = "Tabel pentru anul " + an;

    const dateAn = date.filter((x) => Number(x.an) === Number(an));
    console.log(dateAn);
    const dateAnMapate = [];
    for (let i = 0; i < tari.length; i++) {
      const tara = tari[i];

      const PIB = dateAn.find((d) => d.tara === tara && d.indicator === "PIB");
      const POP = dateAn.find((d) => d.tara === tara && d.indicator === "POP");
      const SV = dateAn.find((d) => d.tara === tara && d.indicator === "SV");

      if (PIB && POP && SV) {
        dateAnMapate.push({
          tara: tara,
          valoarePIB: PIB.valoare,
          valoarePop: POP.valoare,
          valoareSV: SV.valoare,
        });
      }
    }
    console.log(dateAnMapate);

    if (dateAnMapate.length === 0) {
      table.style.display = "none";
      console.log("Nu există suficiente date disponibile");
    } else {
      table.style.display = "inline-block";
      for (let data of dateAnMapate) {
        let rand = document.createElement("tr");
        tbodyElement.append(rand);

        let tdTara = document.createElement("td");
        tdTara.innerText = data.tara;
        rand.append(tdTara);

        let tdPopulatie = document.createElement("td");
        tdPopulatie.innerText = data.valoarePop;
        rand.append(tdPopulatie);
        tdPopulatie.style.background = setBackground(
          dateAnMapate.map((x) => x.valoarePop),
          data.valoarePop,
          0,
          120
        );

        let tdPIB = document.createElement("td");
        tdPIB.innerText = data.valoarePIB;
        rand.append(tdPIB);
        tdPIB.style.background = setBackground(
          dateAnMapate.map((x) => x.valoarePIB),
          data.valoarePIB,
          0,
          120
        );

        let tdSV = document.createElement("td");
        tdSV.innerText = data.valoareSV;
        rand.append(tdSV);
        tdSV.style.background = setBackground(
          dateAnMapate.map((x) => x.valoareSV),
          data.valoareSV,
          0,
          120
        );
      }
    }
  }
}
document.addEventListener("DOMContentLoaded", aplicatie);
