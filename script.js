const canvas = document.getElementById("networkCanvas");
const ctx = canvas.getContext("2d");

let particles = [];

const mouse = {
    x: null,
    y: null,
    radius: 140
};


// =============================
// CANVAS BOYUTU
// =============================

function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    createParticles();
}

window.addEventListener("resize", resizeCanvas);


// =============================
// MOUSE TAKİBİ
// =============================

canvas.addEventListener("mousemove", (e) => {

    const rect = canvas.getBoundingClientRect();

    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
});


canvas.addEventListener("mouseleave", () => {
    mouse.x = null;
    mouse.y = null;
});


// =============================
// PARTICLE CLASS
// =============================

class Particle {

    constructor(x, y) {

        this.x = x;
        this.y = y;

        this.size = Math.random() * 2.5 + 1;

        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;

        // Bazıları mavi, bazıları mor
        this.color =
            Math.random() > 0.5
                ? "#5470ff"
                : "#8b4dff";
    }


    // -------------------------
    // HAREKET
    // -------------------------

    update() {

        this.x += this.speedX;
        this.y += this.speedY;


        // Sağdan çıkarsa geri dön
        if (this.x > canvas.width || this.x < 0) {
            this.speedX *= -1;
        }


        // Yukarı/aşağı çıkarsa geri dön
        if (this.y > canvas.height || this.y < 0) {
            this.speedY *= -1;
        }


        // =====================
        // MOUSE ETKİLEŞİMİ
        // =====================

        if (mouse.x !== null && mouse.y !== null) {

            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;

            const distance = Math.sqrt(
                dx * dx + dy * dy
            );


            if (distance < mouse.radius && distance > 0) {

                const force =
                    (mouse.radius - distance) /
                    mouse.radius;

                this.x -= (dx / distance) * force * 1.5;
                this.y -= (dy / distance) * force * 1.5;
            }
        }
    }


    // -------------------------
    // NOKTAYI ÇİZ
    // -------------------------

    draw() {

        ctx.beginPath();

        ctx.arc(
            this.x,
            this.y,
            this.size,
            0,
            Math.PI * 2
        );

        ctx.fillStyle = this.color;

        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;

        ctx.fill();

        ctx.shadowBlur = 0;
    }draw() {

    // DIŞ NEON PARLAMA
    ctx.beginPath();

    ctx.arc(
        this.x,
        this.y,
        this.size * 3,
        0,
        Math.PI * 2
    );

    const glow = ctx.createRadialGradient(
        this.x,
        this.y,
        0,
        this.x,
        this.y,
        this.size * 3
    );

    glow.addColorStop(0, this.color);
    glow.addColorStop(0.3, this.color);
    glow.addColorStop(1, "transparent");

    ctx.fillStyle = glow;
    ctx.globalAlpha = 0.35;

    ctx.fill();

    ctx.globalAlpha = 1;


    // ANA PARLAK NOKTA
    ctx.beginPath();

    ctx.arc(
        this.x,
        this.y,
        this.size,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = "#ffffff";

    ctx.shadowBlur = 10;
    ctx.shadowColor = this.color;

    ctx.fill();


    // RENKLİ MERKEZ
    ctx.beginPath();

    ctx.arc(
        this.x,
        this.y,
        this.size * 0.65,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = this.color;

    ctx.fill();

    ctx.shadowBlur = 0;
}
}


// =============================
// PARTICLE OLUŞTUR
// =============================

function createParticles() {

    particles = [];

    let particleCount;

    if (canvas.width < 500) {
    particleCount = 25;
} else if (canvas.width < 1000) {
    particleCount = 35;
} else {
    particleCount = 50;
}


    for (let i = 0; i < particleCount; i++) {

        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;

        particles.push(
            new Particle(x, y)
        );
    }
}


// =============================
// NOKTALARI BİRBİRİNE BAĞLA
// =============================

function connectParticles() {

    const maxDistance = 125;

    for (let i = 0; i < particles.length; i++) {

        for (let j = i + 1; j < particles.length; j++) {

            const dx =
                particles[i].x - particles[j].x;

            const dy =
                particles[i].y - particles[j].y;

            const distance =
                Math.sqrt(dx * dx + dy * dy);


            if (distance < maxDistance) {

                const opacity =
                    1 - distance / maxDistance;


                ctx.beginPath();

              ctx.strokeStyle =
    `rgba(105, 91, 255, ${opacity * 0.7})`;

ctx.lineWidth = 1;

ctx.moveTo(
    particles[i].x,
    particles[i].y
);

ctx.lineTo(
    particles[j].x,
    particles[j].y
);

ctx.stroke();
                ctx.shadowBlur = 0;
            }
        }
    }
}


// =============================
// ANIMATION LOOP
// =============================

function animate() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    particles.forEach((particle) => {

        particle.update();
        particle.draw();

    });


    connectParticles();


    requestAnimationFrame(animate);
}


// =============================
// START
// =============================

resizeCanvas();
animate();





// =============================
// PROJECT SCROLL ANIMATION
// =============================

const revealElements = document.querySelectorAll(
    ".reveal, .reveal-left, .reveal-right"
);

const revealObserver = new IntersectionObserver(
    (entries, observer) => {

        entries.forEach((entry) => {

            if (entry.isIntersecting) {

                entry.target.classList.add("show");

                observer.unobserve(entry.target);
            }

        });

    },
    {
        threshold: 0.1
    }
);

revealElements.forEach((element) => {

    revealObserver.observe(element);

});



// =============================
// SKILL CARD ANIMATION
// =============================

const skillCards = document.querySelectorAll(".skill-reveal");

const skillObserver = new IntersectionObserver(
    (entries, observer) => {

        entries.forEach((entry) => {

            if (entry.isIntersecting) {

                const cards = [...skillCards];

                const index = cards.indexOf(entry.target);

                entry.target.style.transitionDelay =
                    `${(index % 3) * 0.12}s`;

                entry.target.classList.add("show");

                observer.unobserve(entry.target);
            }

        });

    },
    {
        threshold: 0.15
    }
);


skillCards.forEach((card) => {

    skillObserver.observe(card);

});




// =============================
// CONTACT FORM - WEB3FORMS
// =============================

const contactForm = document.getElementById("contactForm");
const submitBtn = document.getElementById("submitBtn");
const formStatus = document.getElementById("formStatus");

contactForm.addEventListener("submit", async (e) => {

    // Formun normal gönderimini engeller
    e.preventDefault();


    // Formdaki bütün verileri alır
    const formData = new FormData(contactForm);


    // Butonu geçici olarak kapat
    submitBtn.disabled = true;

    submitBtn.querySelector("span").textContent =
        "Gönderiliyor...";


    // Önce eski mesajları temizle
    formStatus.textContent = "";

    formStatus.classList.remove(
        "success",
        "error"
    );


    try {

        const response = await fetch(
            "https://api.web3forms.com/submit",
            {
                method: "POST",
                body: formData
            }
        );


        const data = await response.json();


        if (data.success) {

            formStatus.textContent =
                "✓ Mesajınız başarıyla gönderildi.";

            formStatus.classList.add("success");


            // Formu temizle
            contactForm.reset();

        } else {

            formStatus.textContent =
                "Mesaj gönderilemedi. Lütfen tekrar deneyin.";

            formStatus.classList.add("error");

        }

    } catch (error) {

        formStatus.textContent =
            "Bağlantı hatası oluştu. Lütfen tekrar deneyin.";

        formStatus.classList.add("error");

        console.error(error);

    } finally {

        // Butonu tekrar aktif et
        submitBtn.disabled = false;

        submitBtn.querySelector("span").textContent =
            "Mesaj Gönder";

    }

});


// =============================
// ACTIVE NAVBAR
// =============================

const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".navbar a");


window.addEventListener("scroll", () => {

    let currentSection = "home";


    sections.forEach((section) => {

        const sectionTop = section.offsetTop;

        const sectionHeight = section.offsetHeight;


        if (
            window.scrollY >=
            sectionTop - sectionHeight * 0.25
        ) {

            currentSection = section.getAttribute("id");

        }

    });


    navLinks.forEach((link) => {

        link.classList.remove("active");


        if (
            link.getAttribute("href") ===
            `#${currentSection}`
        ) {

            link.classList.add("active");

        }

    });

});



// =============================
// CLOSE MOBILE MENU
// =============================

const menuToggle =
    document.getElementById("menu-toggle");


navLinks.forEach((link) => {

    link.addEventListener("click", () => {

        menuToggle.checked = false;

    });

});

// =============================
// HEADER SCROLL EFFECT
// =============================

const header =
    document.querySelector(".header");


window.addEventListener("scroll", () => {

    if (window.scrollY > 50) {

        header.classList.add("scrolled");

    } else {

        header.classList.remove("scrolled");

    }

});