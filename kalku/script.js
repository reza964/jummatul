document.getElementById('calculateBtn').addEventListener('click', function() {
    const latitude = parseFloat(document.getElementById('latitude').value);
    const date = new Date(document.getElementById('date').value);
  
    if (isNaN(latitude) || isNaN(date.getTime())) {
      document.getElementById('result').textContent = "Harap masukkan lintang dan tanggal yang valid.";
      return;
    }
  
    const n = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    const delta = 23.44 * Math.sin((360 / 365) * (n - 81) * (Math.PI / 180)); 
    const phi = latitude * (Math.PI / 180);
    const deltaRad = delta * (Math.PI / 180); 
  
    function computeDayLength() {
      const cosTerm = -Math.sin(phi) * Math.sin(deltaRad);
      const hourAngle = Math.acos(cosTerm) * (180 / Math.PI); 
      return (2 * hourAngle) / 15;
    }
  
    const dayDuration = computeDayLength();
    const nightDuration = 24 - dayDuration;
  
    document.getElementById('result').textContent = `
      Durasi siang pada tanggal ${date.toDateString()} di lintang ${latitude}° adalah ${dayDuration.toFixed(2)} jam.
      Durasi malam adalah ${nightDuration.toFixed(2)} jam.
      Deklinasi matahari: ${delta.toFixed(2)}°.
    `;
  
    const ctx1 = document.getElementById('dayNightChart').getContext('2d');
    const ctx2 = document.getElementById('declinationChart').getContext('2d');
    const daysInYear = Array.from({ length: 365 }, (_, i) => i + 1);
    const declinations = daysInYear.map(day => 23.44 * Math.sin((360 / 365) * (day - 81) * (Math.PI / 180)));
  
    if (window.dayNightChart) {
      window.dayNightChart.data.datasets[0].data = [dayDuration, nightDuration];
      window.dayNightChart.update();
    } else {
      window.dayNightChart = new Chart(ctx1, {
        type: 'pie',
        data: {
          labels: ['Siang', 'Malam'],
          datasets: [{
            data: [dayDuration, nightDuration],
            backgroundColor: ['#FFC107', '#03A9F4']
          }]
        },
        options: { responsive: true }
      });
    }
  
    if (window.declinationChart) {
      window.declinationChart.data.datasets[0].data = declinations;
      window.declinationChart.update();
    } else {
      window.declinationChart = new Chart(ctx2, {
        type: 'line',
        data: {
          labels: daysInYear,
          datasets: [{
            label: 'Deklinasi Matahari (°)',
            data: declinations,
            borderColor: '#FF5722',
            tension: 0.3
          }]
        },
        options: { responsive: true }
      });
    }
  });
  