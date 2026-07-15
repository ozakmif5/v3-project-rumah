document.addEventListener("DOMContentLoaded", function () {
    var mobileNavBtns = document.querySelectorAll(".mobile-nav-item");
    var mobileSubBtns = document.querySelectorAll(".mobile-subnav-item");
    var mobileSubnav  = document.getElementById("mobileSubnav");

    var allSections  = ["dashboard","absensi","kehadiran","pengupahan","material","progress","laporan"];
    var pekerjaKeys  = ["absensi","kehadiran","pengupahan"];

    function switchSection(key) {
        allSections.forEach(function (s) {
            var el = document.getElementById(s + "Section");
            if (el) el.classList.toggle("d-none", s !== key);
        });
    }

    function setNavActive(sectionKey) {
        mobileNavBtns.forEach(function (btn) {
            var s = btn.dataset.mobileSection;
            var active = s === sectionKey ||
                         (s === "pekerja" && pekerjaKeys.includes(sectionKey));
            btn.classList.toggle("active-mobile", active);
        });
    }

    function setSubActive(key) {
        mobileSubBtns.forEach(function (btn) {
            btn.classList.toggle("active-sub", btn.dataset.mobileSub === key);
        });
    }

    function showSubnav() {
        mobileSubnav.classList.add("show");
        document.body.classList.add("has-subnav");
    }

    function hideSubnav() {
        mobileSubnav.classList.remove("show");
        document.body.classList.remove("has-subnav");
    }

    mobileNavBtns.forEach(function (btn) {
        btn.addEventListener("click", function () {
            var s = btn.dataset.mobileSection;
            if (s === "pekerja") {
                showSubnav();
                var activeSub = document.querySelector(".mobile-subnav-item.active-sub");
                var subKey = activeSub ? activeSub.dataset.mobileSub : "absensi";
                switchSection(subKey);
                setSubActive(subKey);
                setNavActive(subKey);
            } else {
                hideSubnav();
                switchSection(s);
                setNavActive(s);
            }
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    });

    mobileSubBtns.forEach(function (btn) {
        btn.addEventListener("click", function () {
            var subKey = btn.dataset.mobileSub;
            switchSection(subKey);
            setSubActive(subKey);
            setNavActive(subKey);
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    });
});
