(() => {
    "use strict";

    const $ = (selector, root = document) => root.querySelector(selector);
    const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
    const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ============================================================
       Smooth scrolling
       ============================================================ */
    let lenis = null;
    if (typeof Lenis !== "undefined") {
        lenis = new Lenis({
            duration: 1.1,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 1,
            anchors: false
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    }

    /* ============================================================
       Dark mode
       ============================================================ */
    const themeToggle = $("#DarkModeToggle");
    const themeIconPath = themeToggle ? themeToggle.querySelector("path") : null;
    const moonPath = "M12 21q-3.75 0-6.38-2.63T3 12t2.63-6.38T12 3q.35 0 .69.02.34.02.66.07-1.03.73-1.64 1.89T11.1 7.5q0 2.25 1.57 3.82T16.5 12.9q1.38 0 2.53-.61t1.88-1.64q.05.33.07.66T21 12q0 3.75-2.63 6.38T12 21Z";
    const sunPath = "M12 17a5 5 0 1 1 0-10 5 5 0 0 1 0 10Zm0-2a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-1-13h2v3h-2V2Zm0 20h2v-3h-2v3ZM2 11h3v2H2v-2Zm17 0h3v2h-3v-2ZM4.93 5.64 6.34 4.23l2.12 2.12-1.41 1.41-2.12-2.12Zm11.61 11.61 1.41-1.41 2.12 2.12-1.41 1.41-2.12-2.12Zm0-11.61 2.12-2.12 1.41 1.41-2.12 2.12-1.41-1.41ZM4.93 18.36l2.12-2.12 1.41 1.41-2.12 2.12-1.41-1.41Z";

    function applyTheme(theme, persist) {
        document.documentElement.setAttribute("data-theme", theme);
        if (themeIconPath) themeIconPath.setAttribute("d", theme === "dark" ? sunPath : moonPath);
        if (persist) {
            try {
                localStorage.setItem("pallet-docs-theme", theme);
            } catch (error) {
                /* Storage can be unavailable in private browsing. */
            }
        }
    }

    let storedTheme = null;
    try {
        storedTheme = localStorage.getItem("pallet-docs-theme");
    } catch (error) {
        storedTheme = null;
    }
    const systemPrefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    applyTheme(storedTheme || (systemPrefersDark ? "dark" : "light"), false);

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            const current = document.documentElement.getAttribute("data-theme");
            applyTheme(current === "dark" ? "light" : "dark", true);
        });
    }

    /* ============================================================
       Post data — 24 visible posts + 6 archive posts
       ============================================================ */
    const posts = [
        {
            id: "p01",
            title: "The quiet return of the personal website",
            category: "Design",
            excerpt: "A smaller, stranger, more personal web is taking shape. Here is why that matters for the rest of us.",
            author: "PALLETDOCS Team",
            date: "Nov 22, 2026",
            iso: "2026-11-22",
            readTime: "6 min read",
            poster: 1
        },
        {
            id: "p02",
            title: "Designing interfaces that feel instant",
            category: "Design",
            excerpt: "Perceived speed is not the same thing as load time. Small details can make a product feel alive.",
            author: "Mara Chen",
            date: "Nov 20, 2026",
            iso: "2026-11-20",
            readTime: "8 min read",
            poster: 2
        },
        {
            id: "p03",
            title: "What good documentation actually does",
            category: "Guides",
            excerpt: "Documentation is not a manual. It is the friendly colleague who is always in the room when you need them.",
            author: "Theo Grant",
            date: "Nov 18, 2026",
            iso: "2026-11-18",
            readTime: "5 min read",
            poster: 3
        },
        {
            id: "p04",
            title: "A field guide to shipping on Fridays",
            category: "Engineering",
            excerpt: "Ship small, watch closely, and keep the rollback button warm. A practical ritual for calmer releases.",
            author: "Nadia Rahman",
            date: "Nov 16, 2026",
            iso: "2026-11-16",
            readTime: "7 min read",
            poster: 4
        },
        {
            id: "p05",
            title: "Why the web still needs weird little corners",
            category: "Culture",
            excerpt: "Polish is useful, but sameness is expensive. The best sites leave room for delight and idiosyncrasy.",
            author: "Ellis Park",
            date: "Nov 14, 2026",
            iso: "2026-11-14",
            readTime: "4 min read",
            poster: 5
        },
        {
            id: "p06",
            title: "The new economics of open source maintenance",
            category: "Technology",
            excerpt: "Everyone consumes the commons. Fewer people fund it. What changes when maintainers treat that as a design problem?",
            author: "Jules Okafor",
            date: "Nov 12, 2026",
            iso: "2026-11-12",
            readTime: "9 min read",
            poster: 6
        },
        {
            id: "p07",
            title: "CSS architecture for teams that move fast",
            category: "Design",
            excerpt: "A set of conventions that keeps styles readable when the roadmap refuses to slow down.",
            author: "Iris Novak",
            date: "Nov 10, 2026",
            iso: "2026-11-10",
            readTime: "6 min read",
            poster: 7
        },
        {
            id: "p08",
            title: "The case for boring infrastructure",
            category: "Engineering",
            excerpt: "Novelty is a cost, not a virtue. Boring systems buy you the freedom to be interesting somewhere else.",
            author: "Owen Blake",
            date: "Nov 8, 2026",
            iso: "2026-11-08",
            readTime: "7 min read",
            poster: 1
        },
        {
            id: "p09",
            title: "How we cut our bundle size in half",
            category: "Technology",
            excerpt: "No rewrite, no heroics. Just a stack of unglamorous decisions that added up to a much faster page.",
            author: "PALLETDOCS Team",
            date: "Nov 6, 2026",
            iso: "2026-11-06",
            readTime: "10 min read",
            poster: 2
        },
        {
            id: "p10",
            title: "Reading the room before you read the metrics",
            category: "Culture",
            excerpt: "Numbers tell you what happened. Context tells you what to do next. You need both, in that order.",
            author: "Mara Chen",
            date: "Nov 4, 2026",
            iso: "2026-11-04",
            readTime: "5 min read",
            poster: 3
        },
        {
            id: "p11",
            title: "A practical guide to design tokens",
            category: "Guides",
            excerpt: "Start with the decisions you make twice. Build the system around those, and let the rest follow.",
            author: "Theo Grant",
            date: "Nov 2, 2026",
            iso: "2026-11-02",
            readTime: "8 min read",
            poster: 4
        },
        {
            id: "p12",
            title: "Building a writing habit that survives launches",
            category: "Guides",
            excerpt: "A sustainable cadence beats a heroic sprint. Here is how to keep publishing when work gets loud.",
            author: "Nadia Rahman",
            date: "Oct 30, 2026",
            iso: "2026-10-30",
            readTime: "6 min read",
            poster: 5
        },
        {
            id: "p13",
            title: "The hidden cost of infinite feeds",
            category: "Culture",
            excerpt: "Endless scroll is easy to build and hard to justify. A look at what it quietly takes from readers.",
            author: "Ellis Park",
            date: "Oct 28, 2026",
            iso: "2026-10-28",
            readTime: "7 min read",
            poster: 6
        },
        {
            id: "p14",
            title: "What engineering leaders get wrong about velocity",
            category: "Engineering",
            excerpt: "Speed is an outcome of clarity. Measure the queues, not the people standing in them.",
            author: "Jules Okafor",
            date: "Oct 26, 2026",
            iso: "2026-10-26",
            readTime: "9 min read",
            poster: 7
        },
        {
            id: "p15",
            title: "Type systems as a design tool",
            category: "Technology",
            excerpt: "The best types do more than catch bugs. They make the shape of a product impossible to misunderstand.",
            author: "Iris Novak",
            date: "Oct 24, 2026",
            iso: "2026-10-24",
            readTime: "8 min read",
            poster: 1
        },
        {
            id: "p16",
            title: "A small team guide to better code review",
            category: "Guides",
            excerpt: "Fewer comments, better questions, and a shared agreement about what actually deserves a blocking review.",
            author: "Owen Blake",
            date: "Oct 22, 2026",
            iso: "2026-10-22",
            readTime: "6 min read",
            poster: 2
        },
        {
            id: "p17",
            title: "Making dark mode feel considered",
            category: "Design",
            excerpt: "It is not an inversion filter. It is a second design system with its own rhythm and restraint.",
            author: "PALLETDOCS Team",
            date: "Oct 20, 2026",
            iso: "2026-10-20",
            readTime: "5 min read",
            poster: 3
        },
        {
            id: "p18",
            title: "The craft of the careful rollback",
            category: "Engineering",
            excerpt: "Recovery is a feature. Design it before you need it, then practice until it is boring.",
            author: "Mara Chen",
            date: "Oct 18, 2026",
            iso: "2026-10-18",
            readTime: "7 min read",
            poster: 4
        },
        {
            id: "p19",
            title: "Notes on building for slow connections",
            category: "Technology",
            excerpt: "Optimize for the person on a train, not the person on your office Wi-Fi. Everything else gets better too.",
            author: "Theo Grant",
            date: "Oct 16, 2026",
            iso: "2026-10-16",
            readTime: "8 min read",
            poster: 5
        },
        {
            id: "p20",
            title: "Why your brand needs a point of view",
            category: "Culture",
            excerpt: "A visual system can make you recognizable. A clear opinion is what makes you remembered.",
            author: "Nadia Rahman",
            date: "Oct 14, 2026",
            iso: "2026-10-14",
            readTime: "4 min read",
            poster: 6
        },
        {
            id: "p21",
            title: "The long tail of good decisions",
            category: "Ideas",
            excerpt: "Small choices compound quietly. Years later, they are the reason a product feels effortless.",
            author: "Ellis Park",
            date: "Oct 12, 2026",
            iso: "2026-10-12",
            readTime: "11 min read",
            poster: 7
        },
        {
            id: "p22",
            title: "Software as a conversation with the future",
            category: "Ideas",
            excerpt: "Every abstraction is a promise to a person you have not met yet. Make it a generous one.",
            author: "Jules Okafor",
            date: "Oct 10, 2026",
            iso: "2026-10-10",
            readTime: "10 min read",
            poster: 1
        },
        {
            id: "p23",
            title: "The myth of the frictionless product",
            category: "Ideas",
            excerpt: "Friction is not always the enemy. The right amount gives people a moment to understand what they are doing.",
            author: "Iris Novak",
            date: "Oct 8, 2026",
            iso: "2026-10-08",
            readTime: "9 min read",
            poster: 2
        },
        {
            id: "p24",
            title: "What we owe the next maintainer",
            category: "Ideas",
            excerpt: "Leave a trail, name your assumptions, and resist the clever solution that only you can decode.",
            author: "Owen Blake",
            date: "Oct 6, 2026",
            iso: "2026-10-06",
            readTime: "12 min read",
            poster: 3
        }
    ];

    const archivePosts = [
        {
            id: "a01",
            title: "A brief history of the button",
            category: "Culture",
            excerpt: "From physical switches to pixel edges, the button has carried more design history than most interfaces admit.",
            author: "PALLETDOCS Team",
            date: "Sep 28, 2026",
            iso: "2026-09-28",
            readTime: "6 min read",
            poster: 4
        },
        {
            id: "a02",
            title: "When the monolith was the right call",
            category: "Engineering",
            excerpt: "Before you split it, ask what you are actually separating. Sometimes the seam is only in the diagram.",
            author: "Mara Chen",
            date: "Sep 21, 2026",
            iso: "2026-09-21",
            readTime: "8 min read",
            poster: 5
        },
        {
            id: "a03",
            title: "The web we keep rebuilding",
            category: "Technology",
            excerpt: "Every generation rediscovers the same tensions: openness, speed, control, and the urge to make things simple.",
            author: "Theo Grant",
            date: "Sep 14, 2026",
            iso: "2026-09-14",
            readTime: "10 min read",
            poster: 6
        },
        {
            id: "a04",
            title: "On finishing things",
            category: "Guides",
            excerpt: "The last ten percent is where most projects go to rest. A short essay about closure as a craft.",
            author: "Nadia Rahman",
            date: "Sep 7, 2026",
            iso: "2026-09-07",
            readTime: "5 min read",
            poster: 7
        },
        {
            id: "a05",
            title: "Typography for tired eyes",
            category: "Design",
            excerpt: "Line length, contrast, and rhythm matter more than the typeface you picked in a moment of enthusiasm.",
            author: "Ellis Park",
            date: "Aug 31, 2026",
            iso: "2026-08-31",
            readTime: "7 min read",
            poster: 1
        },
        {
            id: "a06",
            title: "The first version is a conversation",
            category: "Ideas",
            excerpt: "Ship the smallest thing that lets someone tell you what you got wrong. Then actually listen.",
            author: "Jules Okafor",
            date: "Aug 24, 2026",
            iso: "2026-08-24",
            readTime: "9 min read",
            poster: 2
        }
    ];

    const allPosts = posts.concat(archivePosts);

    function imageFor(post) {
        const position = allPosts.findIndex((item) => item.id === post.id);
        const number = String(position + 1).padStart(2, "0");
        return "./images/real-" + number + ".jpg";
    }

    function createPostMarkup(post, index) {
        return `
            <article class="article-card postCard" style="--i:${index}">
                <div class="articleThumb postThumb">
                    <img loading="lazy" src="${imageFor(post)}" alt="Cover art for ${post.title}" title="${post.title}">
                    <span class="postTag">${post.category}</span>
                </div>
                <div class="articleBody postBody">
                    <div class="articleMeta postMeta">
                        <span class="articleCategory">${post.category}</span>
                        <span class="articleMetaDot"></span>
                        <span>${post.readTime}</span>
                        <time datetime="${post.iso}">${post.date}</time>
                    </div>
                    <h3 class="articleTitle postTitle">
                        <a href="#newsletter" data-open-post="${post.id}" title="Read ${post.title}">${post.title}</a>
                    </h3>
                    <p class="articleExcerpt postExcerpt">${post.excerpt}</p>
                    <div class="articleAuthor postAuthor">
                        <img class="authorAvatar" loading="lazy" src="./images/profile.webp" alt="${post.author}" title="${post.author}">
                        <span>${post.author}</span>
                        <a class="postReadLink" href="#newsletter" data-open-post="${post.id}" title="Read ${post.title}">
                            Read story <span aria-hidden="true">&#8599;</span>
                        </a>
                    </div>
                </div>
            </article>`;
    }

    const groups = [
        { track: $("#latest [data-track]"), items: posts.slice(0, 6) },
        { track: $("#trending [data-track]"), items: posts.slice(6, 12) },
        { track: $("#guides [data-track]"), items: posts.slice(12, 18) },
        { track: $("#ideas [data-track]"), items: posts.slice(18, 24) },
        { track: $("#archive [data-track]"), items: archivePosts }
    ];

    groups.forEach((group) => {
        if (group.track) group.track.innerHTML = group.items.map(createPostMarkup).join("");
    });

    /* ============================================================
       Carousels
       ============================================================ */
    const carousels = [];

    function setupCarousel(root) {
        const scope = root.closest(".blogSection") || root;
        const track = $("[data-track]", root);
        const prev = $(".swiperNav.prev", scope);
        const next = $(".swiperNav.next", scope);
        const dotsWrap = $(".swiperDots", scope);
        if (!track || !prev || !next || !dotsWrap) return null;

        let cardStride = 1;
        let perView = 1;
        let pages = 1;
        let activePage = 0;
        let autoplayTimer = null;
        let isDragging = false;
        let moved = false;
        let startX = 0;
        let startScroll = 0;
        let scrollTicking = false;
        let scrollAnimation = null;

        const pageWidth = () => cardStride * perView;

        function measure() {
            const card = track.querySelector(".postCard");
            if (!card) return;
            const styles = window.getComputedStyle(track);
            const gap = parseFloat(styles.columnGap || styles.gap) || 0;
            cardStride = card.getBoundingClientRect().width + gap;
            if (!Number.isFinite(cardStride) || cardStride <= 0) return;
            perView = Math.max(1, Math.round((track.clientWidth + gap) / cardStride));
            pages = Math.max(1, Math.ceil(track.children.length / perView));
            activePage = Number.isFinite(activePage) ? Math.min(activePage, pages - 1) : 0;
            buildDots();
            updateDots();
        }

        function buildDots() {
            dotsWrap.innerHTML = "";
            for (let i = 0; i < pages; i += 1) {
                const dot = document.createElement("button");
                dot.type = "button";
                dot.className = "swiperDot" + (i === activePage ? " is-active" : "");
                dot.setAttribute("role", "tab");
                dot.setAttribute("aria-label", "Go to page " + (i + 1) + " of " + pages);
                dot.setAttribute("aria-selected", i === activePage ? "true" : "false");
                dot.addEventListener("click", () => goTo(i));
                dotsWrap.appendChild(dot);
            }
        }

        function updateDots() {
            $$(".swiperDot", dotsWrap).forEach((dot, i) => {
                dot.classList.toggle("is-active", i === activePage);
                dot.setAttribute("aria-selected", i === activePage ? "true" : "false");
            });
        }

        function cancelScrollAnimation() {
            if (scrollAnimation) window.clearTimeout(scrollAnimation);
            scrollAnimation = null;
            track.classList.remove("isScrolling");
        }

        function animateScrollTo(target) {
            cancelScrollAnimation();
            if (reduceMotion || isDragging) {
                track.scrollLeft = target;
                syncFromScroll();
                return;
            }
            const start = track.scrollLeft;
            const distance = target - start;
            if (Math.abs(distance) < 1) return;

            track.classList.add("isScrolling");
            const startedAt = window.performance.now();
            const duration = 420;

            function frame() {
                const now = window.performance.now();
                const progress = Math.min(1, (now - startedAt) / duration);
                const eased = progress < 0.5
                    ? 4 * progress * progress * progress
                    : 1 - Math.pow(-2 * progress + 2, 3) / 2;
                track.scrollLeft = start + distance * eased;
                if (progress < 1) {
                    scrollAnimation = window.setTimeout(frame, 16);
                } else {
                    scrollAnimation = null;
                    track.classList.remove("isScrolling");
                    syncFromScroll();
                }
            }

            scrollAnimation = window.setTimeout(frame, 16);
        }

        function goTo(page) {
            if (!cardStride) measure();
            if (!Number.isFinite(page) || !Number.isFinite(cardStride) || !Number.isFinite(pages)) return;
            activePage = Math.max(0, Math.min(pages - 1, page));
            const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
            const target = Math.min(activePage * pageWidth(), maxScroll);
            animateScrollTo(target);
            updateDots();
        }

        function syncFromScroll() {
            if (!cardStride) return;
            const maxScroll = track.scrollWidth - track.clientWidth;
            if (maxScroll <= 2) {
                activePage = 0;
                updateDots();
                return;
            }
            const nearest = Math.round(track.scrollLeft / pageWidth());
            const nextPage = Math.max(0, Math.min(pages - 1, nearest));
            if (nextPage !== activePage) {
                activePage = nextPage;
                updateDots();
            }
        }

        function stopAutoplay() {
            if (autoplayTimer) window.clearInterval(autoplayTimer);
            autoplayTimer = null;
        }

        function startAutoplay() {
            // Sliders stay still unless the reader uses arrows, dots, keyboard, or drag.
            stopAutoplay();
        }

        prev.addEventListener("click", () => goTo(activePage - 1));
        next.addEventListener("click", () => goTo(activePage + 1));

        root.addEventListener("keydown", (event) => {
            if (event.key === "ArrowLeft") {
                event.preventDefault();
                goTo(activePage - 1);
            } else if (event.key === "ArrowRight") {
                event.preventDefault();
                goTo(activePage + 1);
            }
        });

        track.addEventListener("scroll", () => {
            if (scrollTicking) return;
            scrollTicking = true;
            window.requestAnimationFrame(() => {
                syncFromScroll();
                scrollTicking = false;
            });
        }, { passive: true });

        track.addEventListener("pointerdown", (event) => {
            if (event.pointerType === "mouse" && event.button !== 0) return;
            cancelScrollAnimation();
            isDragging = true;
            moved = false;
            startX = event.clientX;
            startScroll = track.scrollLeft;
            track.classList.add("isDragging");
            stopAutoplay();
            try {
                track.setPointerCapture(event.pointerId);
            } catch (error) {
                /* Pointer capture is not critical. */
            }
        });

        track.addEventListener("pointermove", (event) => {
            if (!isDragging) return;
            const delta = event.clientX - startX;
            if (Math.abs(delta) > 4) moved = true;
            track.scrollLeft = startScroll - delta;
        });

        function endDrag(event) {
            if (!isDragging) return;
            isDragging = false;
            track.classList.remove("isDragging");
            try {
                track.releasePointerCapture(event.pointerId);
            } catch (error) {
                /* Pointer capture is not critical. */
            }
            window.setTimeout(() => {
                if (moved && cardStride) goTo(Math.round(track.scrollLeft / pageWidth()));
                startAutoplay();
            }, 30);
        }

        track.addEventListener("pointerup", endDrag);
        track.addEventListener("pointercancel", endDrag);
        track.addEventListener("pointerleave", endDrag);
        track.addEventListener("click", (event) => {
            if (moved) {
                event.preventDefault();
                event.stopPropagation();
                moved = false;
            }
        }, true);

        root.addEventListener("mouseenter", stopAutoplay);
        root.addEventListener("mouseleave", startAutoplay);
        root.addEventListener("focusin", stopAutoplay);
        root.addEventListener("focusout", startAutoplay);

        if (typeof ResizeObserver !== "undefined") {
            const observer = new ResizeObserver(() => measure());
            observer.observe(track);
        } else {
            window.addEventListener("resize", measure);
        }

        measure();
        startAutoplay();

        return {
            refresh() {
                measure();
            },
            startAutoplay,
            stopAutoplay
        };
    }

    $$("[data-swiper]").forEach((root) => {
        const instance = setupCarousel(root);
        if (instance) carousels.push(instance);
    });

    /* ============================================================
       Archive reveal
       ============================================================ */
    const archiveSection = $("#archive");
    const loadMoreBtn = $("#loadMoreBtn");

    function revealArchive(shouldScroll) {
        if (!archiveSection) return;
        const wasHidden = archiveSection.hidden;
        archiveSection.hidden = false;
        if (loadMoreBtn) {
            loadMoreBtn.textContent = "All Blogs Shown";
            loadMoreBtn.disabled = true;
        }
        carousels.forEach((carousel) => carousel.refresh());
        if (wasHidden && shouldScroll) {
            window.setTimeout(() => {
                scrollToTarget(archiveSection);
            }, 120);
        }
    }

    if (loadMoreBtn) loadMoreBtn.addEventListener("click", () => revealArchive(true));
    $$("[data-reveal-archive]").forEach((link) => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            revealArchive(true);
        });
    });

    /* ============================================================
       Article modal
       ============================================================ */
    const modal = $("#postModal");
    const modalImage = $("#modalImage");
    const modalCategory = $("#modalCategory");
    const modalReadTime = $("#modalReadTime");
    const modalDate = $("#modalDate");
    const modalTitle = $("#modalTitle");
    const modalExcerpt = $("#modalExcerpt");
    const modalAvatar = $("#modalAvatar");
    const modalAuthorName = $("#modalAuthorName");
    let lastFocusedTrigger = null;

    function openPost(id, trigger) {
        const post = allPosts.find((item) => item.id === id);
        if (!post || !modal) return;

        modalImage.src = imageFor(post);
        modalImage.alt = "Cover art for " + post.title;
        modalImage.title = post.title;
        modalCategory.textContent = post.category;
        modalReadTime.textContent = post.readTime;
        modalDate.textContent = post.date;
        modalDate.setAttribute("datetime", post.iso);
        modalTitle.textContent = post.title;
        modalExcerpt.textContent = post.excerpt;
        modalAvatar.src = "./images/profile.webp";
        modalAvatar.alt = post.author;
        modalAvatar.title = post.author;
        modalAuthorName.textContent = post.author;

        lastFocusedTrigger = trigger || null;
        modal.hidden = false;
        document.body.style.overflow = "hidden";
        if (lenis) lenis.stop();
        carousels.forEach((carousel) => carousel.stopAutoplay());
        const closeButton = $(".modalClose", modal);
        if (closeButton) closeButton.focus();
    }

    function closeModal() {
        if (!modal || modal.hidden) return;
        modal.hidden = true;
        document.body.style.overflow = "";
        if (lenis) lenis.start();
        carousels.forEach((carousel) => carousel.startAutoplay());
        if (lastFocusedTrigger && typeof lastFocusedTrigger.focus === "function") lastFocusedTrigger.focus();
    }

    document.addEventListener("click", (event) => {
        const trigger = event.target.closest("[data-open-post]");
        if (trigger) {
            event.preventDefault();
            openPost(trigger.getAttribute("data-open-post"), trigger);
            return;
        }
        if (event.target.closest("[data-close-modal]")) {
            event.preventDefault();
            closeModal();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") closeModal();
    });

    /* ============================================================
       Newsletter
       ============================================================ */
    const newsletterForm = $("#newsletterForm");
    const newsletterEmail = $("#newsletterEmail");
    const newsletterMessage = $("#newsletterMessage");

    if (newsletterForm && newsletterEmail && newsletterMessage) {
        newsletterForm.addEventListener("submit", (event) => {
            event.preventDefault();
            if (!newsletterEmail.value.trim() || !newsletterEmail.checkValidity()) {
                newsletterMessage.hidden = false;
                newsletterMessage.textContent = "Enter a valid email address to subscribe.";
                newsletterEmail.focus();
                return;
            }
            newsletterMessage.hidden = false;
            newsletterMessage.textContent = "Thanks. You are on the list.";
            newsletterForm.reset();
        });
    }

    /* ============================================================
       FAQ accordion — keep one answer open at a time
       ============================================================ */
    const faqItems = $$(".faqItem");
    faqItems.forEach((item) => {
        item.addEventListener("toggle", () => {
            if (!item.open) return;
            faqItems.forEach((other) => {
                if (other !== item) other.open = false;
            });
        });
    });

    /* ============================================================
       Scroll progress, back to top, anchor links, scroll cue
       ============================================================ */
    const progressBar = $(".readingProgress span");
    const scrollTopBtn = $("#scrollTopBtn");

    function scrollToTarget(target) {
        if (!target) return;
        if (lenis) {
            lenis.scrollTo(target, { offset: -18, duration: 1.1 });
        } else {
            target.scrollIntoView({
                behavior: reduceMotion ? "auto" : "smooth",
                block: "start"
            });
        }
    }

    function updateScrollState() {
        const doc = document.documentElement;
        const maxScroll = doc.scrollHeight - window.innerHeight;
        const percent = maxScroll > 0 ? Math.min(100, Math.max(0, (window.scrollY / maxScroll) * 100)) : 0;
        if (progressBar) progressBar.style.width = percent + "%";
        if (scrollTopBtn) scrollTopBtn.classList.toggle("visible", window.scrollY > 500);
    }

    window.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    updateScrollState();

    if (scrollTopBtn) {
        scrollTopBtn.addEventListener("click", () => {
            if (lenis) {
                lenis.scrollTo(0, { duration: 1.1 });
            } else {
                window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
            }
        });
    }

    const scrollCue = $(".scrollCue");
    if (scrollCue) {
        scrollCue.addEventListener("click", () => scrollToTarget($("#latest")));
    }

    document.addEventListener("click", (event) => {
        if (event.defaultPrevented) return;
        const link = event.target.closest('a[href^="#"]');
        if (!link) return;
        const hash = link.getAttribute("href");
        if (!hash || hash === "#") return;
        const target = document.querySelector(hash);
        if (!target) return;
        event.preventDefault();
        if (hash === "#archive") revealArchive(false);
        scrollToTarget(target);
    });

    if (window.location.hash === "#archive") revealArchive(false);
    window.addEventListener("hashchange", () => {
        if (window.location.hash === "#archive") revealArchive(false);
    });

    /* ============================================================
       Subtle parallax (mouse-follow effects removed)
       ============================================================ */
    const finePointer = window.matchMedia && window.matchMedia("(pointer: fine)").matches;
    const parallaxElements = $$("[data-parallax]");
    if (!reduceMotion && finePointer && parallaxElements.length) {
        let parallaxTicking = false;

        function updateParallax() {
            const viewportHeight = window.innerHeight;
            parallaxElements.forEach((element) => {
                const rect = element.getBoundingClientRect();
                if (rect.bottom < -100 || rect.top > viewportHeight + 100) return;
                const speed = parseFloat(element.getAttribute("data-parallax")) || 0;
                const offset = (rect.top + rect.height / 2 - viewportHeight / 2) * speed;
                element.style.transform = "translate3d(0, " + offset.toFixed(2) + "px, 0)";
            });
            parallaxTicking = false;
        }

        window.addEventListener("scroll", () => {
            if (parallaxTicking) return;
            parallaxTicking = true;
            window.requestAnimationFrame(updateParallax);
        }, { passive: true });
        updateParallax();
    }

    window.addEventListener("load", () => {
        carousels.forEach((carousel) => carousel.refresh());
        updateScrollState();
    });

    document.addEventListener("visibilitychange", () => {
        if (document.hidden) carousels.forEach((carousel) => carousel.stopAutoplay());
        else carousels.forEach((carousel) => carousel.startAutoplay());
    });
})();
