const heroData = [
{
title:"👁 Our Vision",
text:"To become Bangladesh's most trusted online shopping destination by providing quality products at affordable prices."
},
{
title:"🎯 Our Mission",
text:"Deliver authentic products with fast delivery, affordable prices and excellent customer service."
},
{
title:"🤝 Our Promise",
text:"Your satisfaction is our priority. We are committed to quality, trust and reliable service."
}
];

let current = 0;

const title = document.getElementById("heroTitle");
const text = document.getElementById("heroText");

setInterval(() => {

    title.classList.add("fade-out");
    text.classList.add("fade-out");

    setTimeout(() => {

        current = (current + 1) % heroData.length;

        title.innerHTML = heroData[current].title;
        text.innerHTML = heroData[current].text;

        title.classList.remove("fade-out");
        text.classList.remove("fade-out");

    },500);

},3000);
