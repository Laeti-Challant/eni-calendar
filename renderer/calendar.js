export class Calendar {
  constructor(datePicker, calendar) {
    this.datePicker = document.getElementById(datePicker);
    this.calendar = document.getElementById(calendar);

    // Initialiser avec le mois actuel
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    this.datePicker.value = `${year}-${month}`;

    // Écouter les changements
    this.datePicker.addEventListener("change", () => this.renderCalendar());

    // Afficher le calendrier initial
    this.renderCalendar();
  }
  generateCalendar(year, month) {
    // tableaux des jours
    const days = [];
    const date = new Date(year, month, 1);
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    // séparé en semaine: mettre chaque jour dans un tableau d'une semaine
    const calendar = [];
    let week = [];

    for (let day of days) {
      week.push(day);
      if (day.getDay() === 0) {
        calendar.push(week);
        week = [];
      }
    }
    if (week.length > 0) {
      calendar.push(week);
    }

    // padStart : compléter le début de la première semaine avec des null
    if (calendar.length > 0 && calendar[0].length > 0) {
      const firstDay = calendar[0][0];
      let dayOfWeek = firstDay.getDay();
      // Convertir dimanche (0) en 7, puis ajuster pour lundi = 0
      dayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

      for (let i = 0; i < dayOfWeek; i++) {
        calendar[0].unshift(null);
      }
    }

    // padEnd : compléter la fin de la dernière semaine avec des null
    if (calendar.length > 0) {
      const lastWeek = calendar[calendar.length - 1];
      while (lastWeek.length < 7) {
        lastWeek.push(null);
      }
    }

    return calendar;
  }

  renderCalendar() {
    // Parser la valeur "YYYY-MM" du datePicker
    const [year, month] = this.datePicker.value.split("-").map(Number);

    const calendar = this.generateCalendar(year, month - 1);
    const dayHeader = ["L", "Ma", "Me", "J", "V", "S", "D"];

    // Vider le calendrier avant de le remplir
    this.calendar.innerHTML = "";

    dayHeader.forEach((day) => {
      const div = document.createElement("div");

      div.textContent = day;
      div.classList.add("day-header");
      this.calendar.appendChild(div);
    });

    calendar.forEach((week) => {
      week.forEach((day) => {
        const div = document.createElement("div");
        if (day === null) {
          // Case vide pour les jours hors du mois
          div.classList.add("empty-cell");
        } else {
          div.textContent = day.getDate();
          div.classList.add("day-cell");
        }
        this.calendar.appendChild(div);
      });
    });
  }
}
