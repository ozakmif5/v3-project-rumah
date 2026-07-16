document.addEventListener("DOMContentLoaded", function () {
    const pekerjaToggle = document.getElementById("pekerjaToggle");
    const pekerjaSubmenu = document.getElementById("pekerjaSubmenu");
    const dashboardLink = document.getElementById("dashboardLink");
    const absensiLink = document.getElementById("absensiLink");
    const kehadiranLink = document.getElementById("kehadiranLink");
    const pengupahanLink = document.getElementById("pengupahanLink");
    const materialLink = document.getElementById("materialLink");
    const progressLink = document.getElementById("progressLink");
    const laporanLink = document.getElementById("laporanLink");

    const dashboardSection = document.getElementById("dashboardSection");
    const absensiSection = document.getElementById("absensiSection");
    const kehadiranSection = document.getElementById("kehadiranSection");
    const pengupahanSection = document.getElementById("pengupahanSection");
    const materialSection = document.getElementById("materialSection");
    const progressSection = document.getElementById("progressSection");
    const laporanSection = document.getElementById("laporanSection");

    const attendanceForm = document.getElementById("attendanceForm");
    const workerNameInput = document.getElementById("workerName");
    const attendanceStartDateInput = document.getElementById("attendanceStartDate");
    const attendanceEndDateInput = document.getElementById("attendanceEndDate");
    const attendanceStatusInput = document.getElementById("attendanceStatus");
    const attendanceSalaryInput = document.getElementById("attendanceSalary");
    const attendanceSubmitButton = document.getElementById("attendanceSubmitButton");
    const editCancelButton = document.getElementById("editCancelButton");
    const attendanceTableBody = document.getElementById("attendanceTableBody");
    const attendanceSummaryBody = document.getElementById("attendanceSummaryBody");
    const pengupahanSummaryBody = document.getElementById("pengupahanSummaryBody");
    const countHadir = document.getElementById("countHadir");
    const countIzin = document.getElementById("countIzin");
    const countSakit = document.getElementById("countSakit");
    const countAlpha = document.getElementById("countAlpha");
    const totalPaidOutput = document.getElementById("totalPaid");
    const totalPengeluaranOutput = document.getElementById("pengeluaran");
    const materialCardValue = document.getElementById("material");
    const materialForm = document.getElementById("materialForm");
    const materialNameInput = document.getElementById("materialName");
    const materialQuantityInput = document.getElementById("materialQuantity");
    const materialPriceInput = document.getElementById("materialPrice");
    const materialDateInput = document.getElementById("materialDate");
    const materialTableBody = document.getElementById("materialTableBody");
    const dashboardMaterialBody = document.getElementById("dashboardMaterialBody");
    const progressForm = document.getElementById("progressForm");
    const progressNameInput = document.getElementById("progressName");
    const progressDescriptionInput = document.getElementById("progressDescription");
    const progressPercentInput = document.getElementById("progressPercent");
    const progressStartDateInput = document.getElementById("progressStartDate");
    const progressSubmitButton = document.getElementById("progressSubmitButton");
    const progressCancelButton = document.getElementById("progressCancelButton");
    const progressTableBody = document.getElementById("progressTableBody");
    const activityTableBody = document.getElementById("activityTableBody");
    const laporanTableBody = document.getElementById("laporanTableBody");
    const exportLaporanButton = document.getElementById("exportLaporanButton");
    const laporanTotalUpahOutput = document.getElementById("laporanTotalUpah");
    const laporanTotalMaterialOutput = document.getElementById("laporanTotalMaterial");
    const laporanTotalKeseluruhanOutput = document.getElementById("laporanTotalKeseluruhan");
    const upahTable = document.getElementById("upahTable");

    const sections = {
        dashboard: dashboardSection,
        absensi: absensiSection,
        kehadiran: kehadiranSection,
        pengupahan: pengupahanSection,
        material: materialSection,
        progress: progressSection,
        laporan: laporanSection,
    };

    const linkMap = {
        dashboard: dashboardLink,
        absensi: absensiLink,
        kehadiran: kehadiranLink,
        pengupahan: pengupahanLink,
        material: materialLink,
        progress: progressLink,
        laporan: laporanLink,
    };

    const STORAGE_KEYS = {
        attendance: "renovRumahAttendanceRecords",
        material: "renovRumahMaterialRecords",
        progress: "renovRumahProgressRecords",
    };

    function loadStoredRecords(key, fallback = []) {
        try {
            const storedValue = localStorage.getItem(key);
            if (!storedValue) {
                return fallback;
            }
            const parsedValue = JSON.parse(storedValue);
            return Array.isArray(parsedValue) ? parsedValue : fallback;
        } catch (error) {
            console.warn(`Gagal memuat data ${key}:`, error);
            return fallback;
        }
    }

    function saveStoredRecords(key, records) {
        try {
            localStorage.setItem(key, JSON.stringify(records));
        } catch (error) {
            console.warn(`Gagal menyimpan data ${key}:`, error);
        }
    }

    function normalizeMaterialRecords(records) {
        return records.map((item) => ({
            ...item,
            quantity: Number(item.quantity) || 1,
            price: Number(item.price) || 0,
            totalPrice: Number(item.totalPrice) || (Number(item.quantity) || 1) * (Number(item.price) || 0),
        }));
    }

    function sortMaterialRecords() {
        materialRecords.sort((a, b) => {
            const dateA = a.date || "";
            const dateB = b.date || "";
            return dateB.localeCompare(dateA); // Newest first (descending)
        });
    }

    const attendanceRecords = loadStoredRecords(STORAGE_KEYS.attendance, []);

    function sortAttendanceRecords(records) {
        records.sort((a, b) => {
            // rawDate lebih akurat karena tersimpan berupa YYYY-MM-DD saat generate range
            const dateA = a.rawDate || a.date || "";
            const dateB = b.rawDate || b.date || "";
            return dateB.localeCompare(dateA); // Newest first
        });
    }

    const materialRecords = normalizeMaterialRecords(loadStoredRecords(STORAGE_KEYS.material, []));
    sortMaterialRecords();
    sortAttendanceRecords(attendanceRecords);
    const progressRecords = loadStoredRecords(STORAGE_KEYS.progress, []);
    let editingIndex = null;
    let progressEditingIndex = null;
    let materialEditingIndex = null;

    if (!pekerjaToggle || !pekerjaSubmenu) {
        return;
    }

    pekerjaToggle.addEventListener("click", function (event) {
        event.preventDefault();
        pekerjaSubmenu.classList.toggle("show");
        pekerjaSubmenu.classList.toggle("collapsed");

        const icon = pekerjaToggle.querySelector(".submenu-icon");
        if (icon) {
            icon.classList.toggle("fa-chevron-down");
            icon.classList.toggle("fa-chevron-up");
        }
    });

    function showSection(sectionKey) {
        Object.keys(sections).forEach((key) => {
            if (!sections[key]) {
                return;
            }
            sections[key].classList.toggle("d-none", key !== sectionKey);
        });

        Object.values(linkMap).forEach((link) => {
            if (link) {
                link.classList.remove("active-menu");
            }
        });

        if (linkMap[sectionKey]) {
            linkMap[sectionKey].classList.add("active-menu");
        }
    }

    function renderAttendanceTable() {
        // pastikan urutan berdasarkan tanggal
        sortAttendanceRecords(attendanceRecords);

        if (attendanceRecords.length === 0) {
            attendanceTableBody.innerHTML = "<tr><td colspan=\"5\" class=\"text-center text-muted\">Belum ada data absensi.</td></tr>";
            return;
        }

        attendanceTableBody.innerHTML = attendanceRecords

            .map((record, index) => {
                return `
                    <tr>
                        <td>${record.name}</td>
                        <td>${record.status}</td>
                        <td>Rp${record.salary.toLocaleString('id-ID')}</td>
                        <td>${record.date}</td>
                        <td>
                            <button type="button" class="btn btn-sm btn-outline-primary edit-attendance-btn" data-index="${index}">Edit</button>
                        </td>
                    </tr>
                `;
            })
            .join("");
    }

    function renderKehadiranSection() {
        // pastikan urutan berdasarkan tanggal
        sortAttendanceRecords(attendanceRecords);

        const counts = { Hadir: 0, Izin: 0, Sakit: 0, Alpha: 0 };
        attendanceRecords.forEach((record) => {

            if (counts[record.status] !== undefined) {
                counts[record.status] += 1;
            }
        });

        countHadir.textContent = counts.Hadir;
        countIzin.textContent = counts.Izin;
        countSakit.textContent = counts.Sakit;
        countAlpha.textContent = counts.Alpha;

        if (attendanceRecords.length === 0) {
            attendanceSummaryBody.innerHTML = "<tr><td colspan=\"3\" class=\"text-center text-muted\">Belum ada data kehadiran.</td></tr>";
            return;
        }

        attendanceSummaryBody.innerHTML = attendanceRecords
            .map((record) => {
                return `<tr><td>${record.name}</td><td>${record.status}</td><td>${record.date}</td></tr>`;
            })
            .join("");
    }

    function renderPayrollSummary() {
        const payroll = {};
        attendanceRecords.forEach((record) => {
            const name = record.name.trim();
            if (!payroll[name]) {
                payroll[name] = {
                    name,
                    totalSalary: 0,
                    totalPaid: 0,
                    totalDue: 0,
                    sessions: 0,
                    status: "Belum Bayar",
                };
            }
            payroll[name].totalSalary += Number(record.salary) || 0;
            payroll[name].sessions += 1;
            if (record.paid) {
                payroll[name].totalPaid += Number(record.salary) || 0;
            } else {
                payroll[name].totalDue += Number(record.salary) || 0;
            }
        });

        Object.values(payroll).forEach((item) => {
            if (item.totalDue === 0) {
                item.status = "Lunas";
            } else if (item.totalPaid > 0) {
                item.status = "Proses";
            } else {
                item.status = "Belum Bayar";
            }
        });

        const rows = Object.values(payroll);
        const dashboardRows = rows.length
            ? rows
                  .map((item) => {
                      const status = item.totalDue === 0 ? "Lunas" : item.totalPaid === 0 ? "Belum Bayar" : "Proses";
                      const badgeClass = item.totalDue === 0 ? "badge bg-success" : item.totalPaid === 0 ? "badge bg-danger" : "badge bg-warning text-dark";
                      return `
                        <tr>
                            <td>${item.name}</td>
                            <td>Rp${item.totalSalary.toLocaleString("id-ID")}</td>
                            <td><span class="${badgeClass}">${status}</span></td>
                        </tr>`;
                  })
                  .join("")
            : "<tr><td colspan=\"3\" class=\"text-center text-muted\">Belum ada data pengupahan.</td></tr>";

        const pengupahanRows = rows.length
            ? rows
                  .map((item) => {
                      const badgeClass = item.status === "Lunas" ? "badge bg-success" : item.status === "Belum Bayar" ? "badge bg-danger" : "badge bg-warning text-dark";
                      const paidDays = Math.round(item.totalPaid / Math.max(1, item.totalSalary / Math.max(1, item.sessions)));
                      const inputValue = Number.isFinite(paidDays) ? paidDays : 0;
                      return `
                        <tr>
                            <td>${item.name}</td>
                            <td>${item.sessions}</td>
                            <td>Rp${item.totalSalary.toLocaleString("id-ID")}</td>
                            <td>Rp${item.totalPaid.toLocaleString("id-ID")}</td>
                            <td>Rp${item.totalDue.toLocaleString("id-ID")}</td>
                            <td><span class="${badgeClass}">${item.status}</span></td>
                            <td>
                                <form class="d-flex flex-column gap-2 payment-form" data-name="${item.name.trim().toLowerCase()}">
                                    <input type="number" class="form-control form-control-sm payment-paid-input" data-name="${item.name.trim().toLowerCase()}" value="${inputValue}" min="0" max="${item.sessions}">
                                    <small class="text-muted">Hari dibayar</small>
                                    <button type="submit" class="btn btn-sm btn-outline-primary">Submit</button>
                                </form>
                            </td>
                        </tr>`;
                  })
                  .join("")
            : "<tr><td colspan=\"6\" class=\"text-center text-muted\">Belum ada data pengupahan.</td></tr>";

        if (upahTable) {
            const upahBody = upahTable.querySelector("tbody");
            if (upahBody) {
                upahBody.innerHTML = dashboardRows;
            }
        }

        if (pengupahanSummaryBody) {
            pengupahanSummaryBody.innerHTML = pengupahanRows;
        }

        renderDashboardTotals();
    }

    function renderDashboardTotals() {
        const totalSalary = attendanceRecords.reduce((sum, record) => sum + (Number(record.salary) || 0), 0);
        const totalPaid = attendanceRecords.reduce((sum, record) => sum + (record.paid ? (Number(record.salary) || 0) : 0), 0);
        const totalMaterial = materialRecords.reduce((sum, item) => sum + item.totalPrice, 0);
        const totalPengeluaran = totalSalary + totalMaterial;


        if (totalPaidOutput) {
            totalPaidOutput.textContent = `Rp${totalPaid.toLocaleString("id-ID")}`;
        }
        if (totalPengeluaranOutput) {
            totalPengeluaranOutput.textContent = `Rp${totalPengeluaran.toLocaleString("id-ID")}`;
        }
        const upahValue = document.getElementById("upah");
        if (upahValue) {
            upahValue.textContent = `Rp${totalSalary.toLocaleString("id-ID")}`;
        }
        renderLaporanTable();
    }


    function setDefaultDate() {
        const today = new Date();
        const dateValue = today.toISOString().slice(0, 10);
        if (attendanceStartDateInput) {
            attendanceStartDateInput.value = dateValue;
        }
        if (attendanceEndDateInput) {
            attendanceEndDateInput.value = dateValue;
        }
    }

    function resetAttendanceForm() {
        attendanceForm.reset();
        if (attendanceStartDateInput) {
            attendanceStartDateInput.value = new Date().toISOString().slice(0, 10);
        }
        if (attendanceEndDateInput) {
            attendanceEndDateInput.value = new Date().toISOString().slice(0, 10);
        }
        if (attendanceSalaryInput) {
            attendanceSalaryInput.value = "";
        }
        attendanceStatusInput.value = "Hadir";
        attendanceSubmitButton.textContent = "Simpan";
        editCancelButton.classList.add("d-none");
        editingIndex = null;
    }

    if (attendanceForm) {
        attendanceForm.addEventListener("submit", function (event) {
            event.preventDefault();
            const name = workerNameInput.value.trim();
            const status = attendanceStatusInput.value;
            const salary = attendanceSalaryInput ? Number(attendanceSalaryInput.value) : 0;
            const startDateValue = attendanceStartDateInput ? attendanceStartDateInput.value : null;
            const endDateValue = attendanceEndDateInput ? attendanceEndDateInput.value : null;

            if (name === "" || !startDateValue || !endDateValue || !salary) {
                return;
            }

            if (new Date(endDateValue) < new Date(startDateValue)) {
                alert("Tanggal selesai tidak boleh sebelum tanggal mulai.");
                return;
            }

            const dateRange = getDateRangeList(startDateValue, endDateValue);
            const paid = editingIndex !== null ? attendanceRecords[editingIndex]?.paid : false;
            const dailyRecords = dateRange.map((dateValue) => ({
                name,
                status,
                salary,
                date: convertDateInputToLocale(dateValue),
                rawDate: dateValue,
                paid,
            }));

            if (editingIndex !== null) {
                attendanceRecords.splice(editingIndex, 1, ...dailyRecords);
            } else {
                attendanceRecords.unshift(...dailyRecords);
            }

            sortAttendanceRecords(attendanceRecords);
            saveStoredRecords(STORAGE_KEYS.attendance, attendanceRecords);
            renderAttendanceTable();
            renderKehadiranSection();
            renderPayrollSummary();

            resetAttendanceForm();
            workerNameInput.focus();
        });
    }

    if (materialForm) {
        materialForm.addEventListener("submit", function (event) {
            event.preventDefault();
            const name = materialNameInput.value.trim();
            const quantity = materialQuantityInput ? Number(materialQuantityInput.value) : 0;
            const price = materialPriceInput ? Number(materialPriceInput.value) : 0;
            const materialDate = materialDateInput ? materialDateInput.value : "";
            if (name === "" || quantity <= 0 || price <= 0 || !materialDate) {
                return;
            }

            const totalPrice = quantity * price;
            const materialData = { name, quantity, price, totalPrice, date: materialDate };
            if (materialEditingIndex !== null) {
                materialRecords[materialEditingIndex] = materialData;
            } else {
                materialRecords.unshift(materialData);
            }
            sortMaterialRecords();
            updateMaterialTotals();
            renderMaterialTable();
            renderDashboardMaterialTable();
            renderDashboardTotals();
            renderLaporanTable();

            saveStoredRecords(STORAGE_KEYS.material, materialRecords);

            materialForm.reset();
            materialPriceInput.value = "";
            materialQuantityInput.value = "";
            if (materialDateInput) {
                materialDateInput.value = new Date().toISOString().slice(0, 10);
            }
            materialEditingIndex = null;
            materialNameInput.focus();
            return;
            renderDashboardMaterialTable();
            updateMaterialTotals();
    renderDashboardTotals();
            renderDashboardTotals();
            renderLaporanTable();

            materialForm.reset();
            materialPriceInput.value = "";
            materialQuantityInput.value = "";
            if (materialDateInput) {
                materialDateInput.value = new Date().toISOString().slice(0, 10);
            }
            materialEditingIndex = null;
            materialNameInput.focus();
        });
    }

    const importLaporanButton = document.getElementById("importLaporanButton");
    const importLaporanFileInput = document.getElementById("importLaporanFileInput");

    if (importLaporanButton && importLaporanFileInput) {
        importLaporanButton.addEventListener("click", function () {
            importLaporanFileInput.click();
        });

        importLaporanFileInput.addEventListener("change", function () {
            const file = importLaporanFileInput.files && importLaporanFileInput.files[0];
            if (!file) {
                return;
            }

            const reader = new FileReader();
            reader.onload = function (e) {
                const text = String(e.target.result || "");
                if (!text.trim()) {
                    alert("File CSV kosong.");
                    return;
                }

                const rows = parseCsvRows(text);
                if (!rows.length) {
                    alert("Gagal membaca CSV.");
                    return;
                }

                const header = rows[0].map((h) => String(h || "").trim());
                const idxTanggal = header.findIndex((h) => h.toLowerCase() === "tanggal");
                const idxKategori = header.findIndex((h) => h.toLowerCase() === "kategori");
                const idxDetail = header.findIndex((h) => h.toLowerCase() === "nama / detail" || h.toLowerCase() === "nama/detail");
                const idxJumlah = header.findIndex((h) => h.toLowerCase() === "jumlah");
                const idxStatus = header.findIndex((h) => h.toLowerCase() === "status");

                if (idxTanggal === -1 || idxKategori === -1 || idxDetail === -1 || idxJumlah === -1 || idxStatus === -1) {
                    alert("Format CSV tidak sesuai (harus: Tanggal, Kategori, Nama / Detail, Jumlah, Status). ");
                    return;
                }

                const importedAttendance = [];
                const importedMaterials = [];

                for (let i = 1; i < rows.length; i++) {
                    const r = rows[i];
                    if (!r || !r.length) continue;

                    const tanggal = String(r[idxTanggal] || "").trim();
                    const kategori = String(r[idxKategori] || "").trim();
                    const detail = String(r[idxDetail] || "").trim();
                    const jumlahRaw = String(r[idxJumlah] || "").trim();
                    const statusRaw = String(r[idxStatus] || "").trim();

                    // Skip baris yang tidak terisi
                    if (!kategori || !detail || !jumlahRaw) continue;

                    if (kategori.toLowerCase() === "upah") {
                        // detail export: "{name} ({status})"
                        // status export: (Hadir/Izin/Sakit/Alpha) atau dari input
                        const m = detail.match(/^(.*)\s*\((.*)\)\s*$/);
                        const name = m ? m[1].trim() : detail.trim();
                        const status = m ? m[2].trim() : "";

                        const salary = parseRupiahNumber(jumlahRaw);
                        const paid = String(statusRaw).toLowerCase() === "lunas";
                        const rawDate = parseToRawDate(tanggal);

                        if (!name || !rawDate) continue;

                        importedAttendance.push({
                            name,
                            status,
                            salary,
                            date: tanggal,
                            rawDate,
                            paid,
                        });
                    } else if (kategori.toLowerCase() === "material") {
                        // detail export: "{name} ({quantity} x Rp{price})"
                        const m1 = detail.match(/^(.*?)\s*\((.*?)\)\s*$/);
                        const name = m1 ? m1[1].trim() : detail.trim();
                        const inside = m1 ? m1[2].trim() : "";

                        // inside: "{quantity} x Rp{price}" (price belum tentu ada Rp di dalam, tapi export ada "Rp")
                        const m2 = inside.match(/([0-9]+(?:[.,][0-9]+)?)\s*x\s*Rp\s*([0-9]+(?:[.,][0-9]+)?)/i);
                        const quantity = m2 ? parseNumberLoose(m2[1]) : NaN;
                        const price = m2 ? parseRupiahNumber(`Rp${m2[2]}`) : NaN;

                        const totalPrice = parseRupiahNumber(jumlahRaw);
                        const rawDate = parseToRawDate(tanggal);
                        if (!name || !rawDate || !Number.isFinite(quantity) || !Number.isFinite(price)) continue;

                        importedMaterials.push({
                            name,
                            quantity,
                            price,
                            totalPrice: Number.isFinite(totalPrice) ? totalPrice : quantity * price,
                            date: rawDate,
                        });
                    }
                }

                // Dedup untuk mencegah dobel entry
                const dedupedAttendance = dedupAttendance(importedAttendance);
                const dedupedMaterials = dedupMaterials(importedMaterials);

                // Merge dengan yang sudah ada (dedup terhadap data existing juga)
                const mergedAttendance = mergeAttendance(dedupedAttendance);
                const mergedMaterials = mergeMaterials(dedupedMaterials);

                saveStoredRecords(STORAGE_KEYS.attendance, mergedAttendance);
                saveStoredRecords(STORAGE_KEYS.material, mergedMaterials);

                // Refresh state & render
                attendanceRecords.splice(0, attendanceRecords.length, ...mergedAttendance);
                materialRecords.splice(0, materialRecords.length, ...normalizeMaterialRecords(mergedMaterials));
                sortAttendanceRecords(attendanceRecords);
                sortMaterialRecords();

                renderAttendanceTable();
                renderKehadiranSection();
                renderPayrollSummary();
                renderMaterialTable();
                renderDashboardMaterialTable();
                renderDashboardTotals();
                renderLaporanTable();

                alert("Import CSV selesai.");
                importLaporanFileInput.value = "";
            };

            reader.onerror = function () {
                alert("Gagal membaca file.");
            };

            reader.readAsText(file);
        });
    }

    if (exportLaporanButton) {
        exportLaporanButton.addEventListener("click", function () {
            exportLaporanToExcel();
        });
    }


    if (progressForm) {
        progressForm.addEventListener("submit", function (event) {
            event.preventDefault();
            const name = progressNameInput.value.trim();
            const description = progressDescriptionInput.value.trim();
            const percent = progressPercentInput ? Number(progressPercentInput.value) : 0;
            const startDate = progressStartDateInput ? progressStartDateInput.value : "";
            if (name === "" || percent < 0 || percent > 100 || !startDate) {
                return;
            }

            const record = { name, description, percent, startDate };
            if (progressEditingIndex !== null) {
                progressRecords[progressEditingIndex] = record;
            } else {
                progressRecords.unshift(record);
            }

            saveStoredRecords(STORAGE_KEYS.progress, progressRecords);
            renderProgressTable();
            renderOverallProgress();
            resetProgressForm();
        });
    }

    if (progressCancelButton) {
        progressCancelButton.addEventListener("click", function () {
            resetProgressForm();
        });
    }

    if (editCancelButton) {
        editCancelButton.addEventListener("click", function () {
            resetAttendanceForm();
        });
    }

    if (materialTableBody) {
        materialTableBody.addEventListener("click", function (event) {
            const button = event.target.closest(".edit-material-btn");
            if (!button) {
                return;
            }
            const index = Number(button.dataset.index);
            const item = materialRecords[index];
            if (!item) {
                return;
            }

            materialEditingIndex = index;
            materialNameInput.value = item.name;
            materialQuantityInput.value = item.quantity;
            materialPriceInput.value = item.price;
            if (materialDateInput) {
                materialDateInput.value = item.date || new Date().toISOString().slice(0, 10);
            }
            showSection("material");
            materialNameInput.focus();
        });
    }

    if (attendanceTableBody) {
        attendanceTableBody.addEventListener("click", function (event) {
            const button = event.target.closest(".edit-attendance-btn");
            if (!button) {
                return;
            }
            const index = Number(button.dataset.index);
            const record = attendanceRecords[index];
            if (!record) {
                return;
            }

            editingIndex = index;
            if (attendanceStartDateInput) {
                attendanceStartDateInput.value = record.rawDateRange?.start || record.rawDate || "";
            }
            if (attendanceEndDateInput) {
                attendanceEndDateInput.value = record.rawDateRange?.end || record.rawDate || "";
            }
            workerNameInput.value = record.name;
            attendanceStatusInput.value = record.status;
            if (attendanceSalaryInput) {
                attendanceSalaryInput.value = record.salary || 0;
            }
            attendanceSubmitButton.textContent = "Update";
            editCancelButton.classList.remove("d-none");
            showSection("absensi");
        });
    }

    if (pengupahanSummaryBody) {
        pengupahanSummaryBody.addEventListener("submit", function (event) {
            const form = event.target.closest(".payment-form");
            if (!form) {
                return;
            }

            event.preventDefault();
            const name = form.dataset.name;
            const input = form.querySelector(".payment-paid-input");
            const paidAmount = Number(input?.value) || 0;
            const matchedRecords = attendanceRecords.filter((record) => record.name.trim().toLowerCase() === name);
            if (matchedRecords.length === 0) {
                return;
            }

            const totalSalary = matchedRecords.reduce((sum, record) => sum + (Number(record.salary) || 0), 0);
            const perDaySalary = matchedRecords.length > 0 ? totalSalary / matchedRecords.length : 0;
            const normalizedDays = Math.max(0, Math.min(Math.round(paidAmount), matchedRecords.length));
            const amountToPay = normalizedDays * perDaySalary;

            matchedRecords.forEach((record) => {
                record.paid = false;
            });

            if (amountToPay > 0) {
                let balance = amountToPay;
                matchedRecords.forEach((record) => {
                    const recordSalary = Number(record.salary) || 0;
                    if (balance >= recordSalary) {
                        record.paid = true;
                        balance -= recordSalary;
                    }
                });
            }

            saveStoredRecords(STORAGE_KEYS.attendance, attendanceRecords);
            renderPayrollSummary();
        });
    }

    if (dashboardLink) {
        dashboardLink.addEventListener("click", function (event) {
            event.preventDefault();
            showSection("dashboard");
        });
    }

    if (absensiLink) {
        absensiLink.addEventListener("click", function (event) {
            event.preventDefault();
            showSection("absensi");
        });
    }

    if (kehadiranLink) {
        kehadiranLink.addEventListener("click", function (event) {
            event.preventDefault();
            showSection("kehadiran");
        });
    }

    if (pengupahanLink) {
        pengupahanLink.addEventListener("click", function (event) {
            event.preventDefault();
            showSection("pengupahan");
        });
    }

    if (materialLink) {
        materialLink.addEventListener("click", function (event) {
            event.preventDefault();
            showSection("material");
        });
    }

    if (progressLink) {
        progressLink.addEventListener("click", function (event) {
            event.preventDefault();
            showSection("progress");
        });
    }

    if (laporanLink) {
        laporanLink.addEventListener("click", function (event) {
            event.preventDefault();
            showSection("laporan");
        });
    }

    if (progressTableBody) {
        progressTableBody.addEventListener("click", function (event) {
            const button = event.target.closest(".edit-progress-btn");
            if (!button) {
                return;
            }
            const index = Number(button.dataset.index);
            const record = progressRecords[index];
            if (!record) {
                return;
            }
            progressEditingIndex = index;
            progressNameInput.value = record.name;
            progressDescriptionInput.value = record.description;
            progressPercentInput.value = record.percent;
            if (progressStartDateInput) {
                progressStartDateInput.value = record.startDate || new Date().toISOString().slice(0, 10);
            }
            if (progressSubmitButton) {
                progressSubmitButton.textContent = "Update";
            }
            if (progressCancelButton) {
                progressCancelButton.classList.remove("d-none");
            }
            showSection("progress");
        });
    }

    function renderMaterialTable() {
        if (!materialTableBody) {
            return;
        }
        if (materialRecords.length === 0) {
            materialTableBody.innerHTML = "<tr><td colspan=\"5\" class=\"text-center text-muted\">Belum ada material.</td></tr>";
            return;
        }

        materialTableBody.innerHTML = materialRecords
            .map((item, index) => {
                const formattedDate = item.date ? new Date(`${item.date}T00:00:00`).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                }) : "-";
                return `
                    <tr>
                        <td>${formattedDate}</td>
                        <td>${item.name}</td>
                        <td>${item.quantity}</td>
                        <td>Rp${item.price.toLocaleString("id-ID")}</td>
                        <td>Rp${item.totalPrice.toLocaleString("id-ID")}</td>
                        <td>
                            <button type="button" class="btn btn-sm btn-outline-primary edit-material-btn" data-index="${index}">Edit</button>
                        </td>
                    </tr>`;
            })
            .join("");
    }

    function updateMaterialTotals() {
        const totalMaterial = materialRecords.reduce((sum, item) => sum + item.totalPrice, 0);
        if (materialCardValue) {
            materialCardValue.textContent = `Rp${totalMaterial.toLocaleString("id-ID")}`;
        }
    }

    function resetMaterialForm() {
        if (materialForm) {
            materialForm.reset();
        }
        if (materialPriceInput) {
            materialPriceInput.value = "";
        }
        if (materialQuantityInput) {
            materialQuantityInput.value = "";
        }
        if (materialDateInput) {
            materialDateInput.value = new Date().toISOString().slice(0, 10);
        }
        materialEditingIndex = null;
    }

    function renderProgressTable() {
        if (!progressTableBody) {
            return;
        }
        if (progressRecords.length === 0) {
            progressTableBody.innerHTML = '<tr><td colspan="4" class="text-center text-muted">Belum ada progres pekerjaan.</td></tr>';
            renderActivityTable();
            return;
        }

        progressTableBody.innerHTML = progressRecords
            .map((item, index) => {
                const formattedDate = item.startDate ? new Date(`${item.startDate}T00:00:00`).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                }) : "-";
                return `
                <tr>
                    <td>${formattedDate}</td>
                    <td>${item.name}</td>
                    <td>${item.description}</td>
                    <td>
                        <div class="progress" style="height:18px;">
                            <div class="progress-bar bg-info" role="progressbar" style="width: ${item.percent}%;" aria-valuenow="${item.percent}" aria-valuemin="0" aria-valuemax="100">
                                ${item.percent}%
                            </div>
                        </div>
                    </td>
                    <td>
                        <button type="button" class="btn btn-sm btn-outline-primary edit-progress-btn" data-index="${index}">Edit</button>
                    </td>
                </tr>`;
            })
            .join("");

        renderActivityTable();
    }

    function renderActivityTable() {
        if (!activityTableBody) {
            return;
        }
        if (progressRecords.length === 0) {
            activityTableBody.innerHTML = '<tr><td colspan="3" class="text-center text-muted">Belum ada aktivitas terbaru.</td></tr>';
            return;
        }

        const today = new Date();
        activityTableBody.innerHTML = progressRecords
            .slice(0, 5)
            .map((item) => {
                const status = item.percent >= 100 ? 'Selesai' : item.percent > 0 ? 'Sedang' : 'Belum';
                const badgeClass = item.percent >= 100 ? 'badge bg-success' : item.percent > 0 ? 'badge bg-warning text-dark' : 'badge bg-secondary';
                return `
                    <tr>
                        <td>${today.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</td>
                        <td>${item.name}</td>
                        <td><span class="${badgeClass}">${status}</span></td>
                    </tr>`;
            })
            .join("");
    }

    function renderOverallProgress() {
        const progressFillRect = document.getElementById("progressFillRect");
        const progressLabel = document.getElementById("progressLabel");
        
        if (!progressFillRect || !progressLabel) {
            return;
        }
        
        const percent = progressRecords.length === 0
            ? 0
            : Math.round(progressRecords.reduce((sum, item) => sum + item.percent, 0) / progressRecords.length);
        
        // Update label
        progressLabel.textContent = `${percent}%`;
        
        // Liquid filling logic from bottom (y=160) to top (y=20)
        // Total height = 140px
        const totalHeight = 140;
        const fillHeight = (percent / 100) * totalHeight;
        const yCoord = 160 - fillHeight;
        
        // Update SVG attributes for clean vector movement
        progressFillRect.setAttribute("y", yCoord);
        progressFillRect.setAttribute("height", fillHeight);
    }

    function resetProgressForm() {
        if (progressForm) {
            progressForm.reset();
        }
        if (progressPercentInput) {
            progressPercentInput.value = "";
        }
        if (progressStartDateInput) {
            progressStartDateInput.value = new Date().toISOString().slice(0, 10);
        }
        progressEditingIndex = null;
        if (progressSubmitButton) {
            progressSubmitButton.textContent = "Tambah";
        }
        if (progressCancelButton) {
            progressCancelButton.classList.add("d-none");
        }
    }

    function renderDashboardMaterialTable() {
        if (!dashboardMaterialBody) {
            return;
        }
        if (materialRecords.length === 0) {
            dashboardMaterialBody.innerHTML = '<tr><td colspan="3" class="text-center text-muted">Belum ada pengeluaran material.</td></tr>';
            return;
        }

        dashboardMaterialBody.innerHTML = materialRecords
            .slice(0, 5)
            .map((item) => `
                <tr>
                    <td>${item.name}</td>
                    <td>Rp${item.totalPrice.toLocaleString("id-ID")}</td>
                    <td><span class="badge bg-warning text-dark">Tercatat</span></td>
                </tr>`)
            .join("");
    }

    function getLaporanRows() {
        const laporanRows = [];

        attendanceRecords.forEach((record) => {
            laporanRows.push({
                date: record.date,
                category: "Upah",
                detail: `${record.name} (${record.status})`,
                amount: record.salary,
                status: record.paid ? "Lunas" : "Belum Bayar",
            });
        });

        materialRecords.forEach((item) => {
            const formattedDate = item.date ? convertDateInputToLocale(item.date) : "-";
            laporanRows.push({
                date: formattedDate,
                category: "Material",
                detail: `${item.name} (${item.quantity} x Rp${item.price.toLocaleString("id-ID")})`,
                amount: item.totalPrice,
                status: "Tercatat",
            });
        });

        return laporanRows;
    }

    function renderLaporanTable() {
        if (!laporanTableBody) {
            return;
        }

        const laporanRows = getLaporanRows();
        const totalUpah = attendanceRecords.reduce((sum, record) => sum + (Number(record.salary) || 0), 0);
        const totalMaterial = materialRecords.reduce((sum, item) => sum + item.totalPrice, 0);
        const totalKeseluruhan = totalUpah + totalMaterial;

        if (laporanTotalUpahOutput) {
            laporanTotalUpahOutput.textContent = `Rp${totalUpah.toLocaleString("id-ID")}`;
        }
        if (laporanTotalMaterialOutput) {
            laporanTotalMaterialOutput.textContent = `Rp${totalMaterial.toLocaleString("id-ID")}`;
        }
        if (laporanTotalKeseluruhanOutput) {
            laporanTotalKeseluruhanOutput.textContent = `Rp${totalKeseluruhan.toLocaleString("id-ID")}`;
        }

        if (laporanRows.length === 0) {
            laporanTableBody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">Belum ada data laporan keuangan.</td></tr>';
            return;
        }

        laporanTableBody.innerHTML = laporanRows
            .map((row) => `
                <tr>
                    <td>${row.date}</td>
                    <td>${row.category}</td>
                    <td>${row.detail}</td>
                    <td>Rp${row.amount.toLocaleString("id-ID")}</td>
                    <td>${row.status}</td>
                </tr>`)
            .join("");
    }


    function downloadCsv(filename, csvContent) {
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    function parseCsvRows(csvText) {
        // Robust CSV parser for basic exported format: comma-separated, supports quoted fields with escaped quotes.
        const rows = [];
        let row = [];
        let field = '';
        let i = 0;
        let inQuotes = false;

        // normalize newlines
        const text = csvText.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

        for (i = 0; i < text.length; i++) {
            const char = text[i];

            if (inQuotes) {
                if (char === '"') {
                    // escaped quote
                    if (text[i + 1] === '"') {
                        field += '"';
                        i++;
                    } else {
                        inQuotes = false;
                    }
                } else {
                    field += char;
                }
                continue;
            }

            if (char === '"') {
                inQuotes = true;
                continue;
            }

            if (char === ',') {
                row.push(field);
                field = '';
                continue;
            }

            if (char === '\n') {
                // end of row
                row.push(field);
                rows.push(row);
                row = [];
                field = '';
                continue;
            }

            field += char;
        }

        // flush last
        if (field.length > 0 || row.length > 0) {
            row.push(field);
            rows.push(row);
        }

        // remove possible trailing empty rows
        return rows.filter((r) => r.some((c) => String(c || '').trim() !== ''));
    }

    function parseRupiahNumber(value) {
        // Accept values like: "Rp1.200.000" or "1.200.000" or "1200000" or "1,200,000"
        const str = String(value || '').trim();
        if (!str) return 0;
        // Remove currency chars and spaces
        const cleaned = str
            .replace(/Rp/gi, '')
            .replace(/[\s]/g, '')
            .replace(/[^0-9.,-]/g, '');

        // Determine decimal separator: if both '.' and ',' present, assume '.' thousand and ',' decimal or vice versa.
        // For our case, export uses plain numbers with thousands '.', no decimals.
        // We'll just remove thousand separators (both '.' or ',') and keep decimal part if present.
        const hasComma = cleaned.includes(',');
        const hasDot = cleaned.includes('.');

        let normalized = cleaned;
        if (hasComma && hasDot) {
            // keep last separator as decimal, remove the other as thousand
            const lastComma = cleaned.lastIndexOf(',');
            const lastDot = cleaned.lastIndexOf('.');
            if (lastComma > lastDot) {
                // comma decimal, dots thousand
                normalized = cleaned.replace(/\./g, '').replace(/,/g, '.');
            } else {
                // dot decimal, commas thousand
                normalized = cleaned.replace(/,/g, '');
            }
        } else if (hasComma && !hasDot) {
            // comma could be thousand or decimal; if 3 digits after comma => thousand
            const parts = cleaned.split(',');
            if (parts.length === 2 && parts[1].length === 3) {
                normalized = parts.join('');
            } else {
                normalized = cleaned.replace(/,/g, '.');
            }
        } else {
            // remove thousand separators
            normalized = cleaned.replace(/\./g, '');
        }

        const num = Number(normalized);
        return Number.isFinite(num) ? num : 0;
    }

    function parseNumberLoose(value) {
        return parseRupiahNumber(value);
    }

    function parseToRawDate(tanggal) {
        const str = String(tanggal || '').trim();
        if (!str) return '';
        // Expect YYYY-MM-DD from import
        if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;
        const d = new Date(str);
        if (isNaN(d.getTime())) return '';
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    }

    function dedupAttendance(items) {
        const map = new Map();
        const existing = new Set();
        attendanceRecords.forEach((r) => {
            existing.add(`${(r.name || '').trim().toLowerCase()}|${r.rawDate || r.date || ''}|${r.status || ''}|${Number(r.salary) || 0}`);
        });

        items.forEach((item) => {
            const key = `${(item.name || '').trim().toLowerCase()}|${item.rawDate || ''}|${item.status || ''}|${Number(item.salary) || 0}`;
            if (existing.has(key)) return;
            if (!map.has(key)) map.set(key, item);
        });

        return Array.from(map.values());
    }

    function dedupMaterials(items) {
        const map = new Map();
        const existing = new Set();
        materialRecords.forEach((r) => {
            existing.add(`${(r.name || '').trim().toLowerCase()}|${r.date || ''}|${Number(r.quantity) || 0}|${Number(r.price) || 0}`);
        });

        items.forEach((item) => {
            const key = `${(item.name || '').trim().toLowerCase()}|${item.date || ''}|${Number(item.quantity) || 0}|${Number(item.price) || 0}`;
            if (existing.has(key)) return;
            if (!map.has(key)) map.set(key, item);
        });

        return Array.from(map.values());
    }

    function mergeAttendance(newItems) {
        // Add imported items to top (newest first later by sort)
        return [...newItems, ...attendanceRecords];
    }

    function mergeMaterials(newItems) {
        return [...newItems, ...materialRecords];
    }

    function exportLaporanToExcel() {

        const rows = [["Tanggal", "Kategori", "Nama / Detail", "Jumlah", "Status"]];

        attendanceRecords.forEach((record) => {
            rows.push([
                record.date,
                "Upah",
                `${record.name} (${record.status})`,
                `Rp${record.salary.toLocaleString("id-ID")}`,
                record.paid ? "Lunas" : "Belum Bayar",
            ]);
        });

        materialRecords.forEach((item) => {
            rows.push([
                "-",
                "Material",
                `${item.name} (${item.quantity} x Rp${item.price.toLocaleString("id-ID")})`,
                `Rp${item.totalPrice.toLocaleString("id-ID")}`,
                "Tercatat",
            ]);
        });

        if (rows.length === 1) {
            alert("Tidak ada data laporan keuangan untuk diekspor.");
            return;
        }

        const csvContent = rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\r\n");
        downloadCsv("laporan_keuangan.csv", csvContent);
    }

    function convertDateInputToLocale(value) {
        if (!value) {
            return "";
        }

        // Expect most inputs as YYYY-MM-DD
        if (typeof value === "string" && value.includes("-")) {
            const parts = value.split("-");
            if (parts.length === 3) {
                const [year, month, day] = parts;
                const date = new Date(`${year}-${month}-${day}T00:00:00`);
                if (!isNaN(date.getTime())) {
                    return date.toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                    });
                }
            }
        }

        // Fallback: try native Date parsing
        const date = new Date(value);
        if (isNaN(date.getTime())) {
            return "-";
        }
        return date.toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    }


    function getDateRangeList(startValue, endValue) {
        if (!startValue || !endValue) {
            return [];
        }

        const startDate = new Date(`${startValue}T00:00:00`);
        const endDate = new Date(`${endValue}T00:00:00`);
        const dates = [];
        const currentDate = new Date(startDate);

        while (currentDate <= endDate) {
            const year = currentDate.getFullYear();
            const month = String(currentDate.getMonth() + 1).padStart(2, "0");
            const day = String(currentDate.getDate()).padStart(2, "0");
            dates.push(`${year}-${month}-${day}`);
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return dates;
    }

    setDefaultDate();
    renderAttendanceTable();
    renderKehadiranSection();
    renderPayrollSummary();
    renderMaterialTable();
    renderDashboardMaterialTable();
    renderProgressTable();
    renderOverallProgress();
    updateMaterialTotals();
    renderDashboardTotals();
    showSection("dashboard");
});
