const heroData = [
{
title: "👁 Our Vision",
text: "To become Bangladesh's most trusted online shopping destination by providing quality products at affordable prices."
},
{
title: "🎯 Our Mission",
text: "Deliver authentic products with fast delivery, affordable prices and excellent customer service."
},
{
title: "🤝 Our Promise",
text: "Your satisfaction is our priority. We are committed to quality, trust and reliable service."
}
];

let current = 0;

setInterval(() => {

current = (current + 1) % heroData.length;

document.getElementById("heroTitle").innerText = heroData[current].title;
document.getElementById("heroText").innerText = heroData[current].text;

}, 3000);
