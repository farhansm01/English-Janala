
const loadLessons = () => {
    fetch("https://openapi.programming-hero.com/api/levels/all")
    .then(res => res.json())
    .then(json => displayLesson(json.data))
}

const displayLesson = (lessons) => {
    const levelContainer = document.getElementById("level-container");
    levelContainer.innerHTML = "";

    for(const lesson of lessons){
        const btnDiv = document.createElement("div");
        btnDiv.innerHTML = `<button id="level-btn-${lesson.level_no}" onclick="loadLevelWord(${lesson.level_no})" class="btn btn-outline btn-primary lesson-btn"><i class="fa-solid fa-book-open"></i>Lesson - ${lesson.level_no}</button>`
        levelContainer.appendChild(btnDiv);
    }
}

const removeActive = () => {
    const allBtn = document.querySelectorAll(".lesson-btn");
    allBtn.forEach(btn => btn.classList.remove("active"));
}

const loadLevelWord = id => {
    manageSpinner(true);
    const url = `https://openapi.programming-hero.com/api/level/${id}`;
    fetch(url)
    .then(res => res.json())
    .then(data => {
        removeActive();
        const clickBtn = document.getElementById(`level-btn-${id}`);
        clickBtn.classList.add("active");
        displayLevelWord(data.data)
    })

}

const displayLevelWord = words => {
    const wordContainer = document.getElementById("word-container");
    wordContainer.innerHTML = "";

    if(words.length === 0){
        wordContainer.innerHTML = `
        <div class="col-span-full text-center space-y-4">
            <img class="mx-auto" src="./assets/alert-error.png" alt="No Vocabulary Found" />
            <p class="font-bangla text-[#79716B]">
                এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।
            </p>
            <h2 class="text-[#292524] text-3xl font-semibold">
                নেক্সট Lesson এ যান
            </h2>
        </div>
        `;
        manageSpinner(false);
        return;
    }

    words.forEach(word => {
        const card = document.createElement("div");
        card.innerHTML = `
            <div class="bg-white rounded-xl shadow-sm text-center p-14 space-y-6">
                <h2 class="text-2xl font-bold">${word.word ? word.word : 'শব্দ পাওয়া যায়নি'}</h2>
                <p class="text-lg">Meaning/Pronunciation</p>
                <div class="font-bangla text-2xl text-[#18181B] font-semibold">
                    "${word.meaning ? word.meaning : 'অর্থ পাওয়া যায়নি'} / ${word.pronunciation ? word.pronunciation : 'pronunciation পাওয়া যায়নি'}"
                </div>
                <div class="flex justify-between items-center">
                    <button
                    onclick="loadWordDetails(${word.id})"
                    class="bg-[#1A91FF10] px-4 py-3 rounded-lg hover:bg-[#1A91FF50] transition-colors duration-300"
                    >
                    <i class="fa-solid fa-circle-info"></i>
                    </button>
                    <button
                    class="bg-[#1A91FF10] px-4 py-3 rounded-lg hover:bg-[#1A91FF50] transition-colors duration-300"
                    >
                    <i class="fa-solid fa-volume-high"></i>
                    </button>
                </div>
            </div>
        `;
        wordContainer.appendChild(card);
    })
    manageSpinner(false);
}


const loadWordDetails = async id => {
    const url = `https://openapi.programming-hero.com/api/word/${id}`;
    const res = await fetch(url);
    const data = await res.json();
    displayWordDetails(data.data);
}

const displayWordDetails = (word) => {
    console.log(word);
    detailsContainer = document.getElementById("details-container");
    detailsContainer.innerHTML = `
        <div>
            <h2 class="text-2xl font-bold">
            ${word.word} (<i class="fa-solid fa-microphone-lines"></i>:${word.pronunciation})
            </h2>
        </div>
        <div class="space-y-3">
            <h3 class="text-xl font-semibold">Meaning</h3>
            <p class="text-xl font-medium font-bangla">${word.meaning}</p>
        </div>
        <div class="space-y-3">
            <h3 class="text-xl font-semibold">Example</h3>
            <p class="text-xl">${word.sentence || 'Example not available'}</p>
        </div>
        <div class="space-y-3">
            <p class="text-xl font-semibold">সমার্থক শব্দ গুলো</p>
            <div class="space-x-3">
                ${createElement(word.synonyms)}
            </div>
        </div>
    `;
    document.getElementById("wordModal").showModal();
}

const createElement = (arr) => {
    if(arr.length === 0){ return ""}
    const elements = arr.map(element => `<span class="btn bg-[#EDF7FF]">${element}</span>`).join(" ");
    return elements; 
}

const manageSpinner = (status) => {
    if(status){
        document.getElementById("spinner").classList.remove("hidden");
        document.getElementById("word-container").classList.add("hidden");
    }else{
        document.getElementById("spinner").classList.add("hidden");
        document.getElementById("word-container").classList.remove("hidden");
    }
}


loadLessons();




document.getElementById("search-btn").addEventListener("click", function(){
    removeActive();
    const searchVal = document.getElementById("input-btn").value.trim().toLowerCase();
    
    if(searchVal !== ""){
        fetch("https://openapi.programming-hero.com/api/words/all")
    .then(res => res.json())
    .then(data => {
        const allWords = data.data;
        const filteredWords = allWords.filter(word => word.word.toLowerCase().includes(searchVal));
        displayLevelWord(filteredWords);
    })
    }
})