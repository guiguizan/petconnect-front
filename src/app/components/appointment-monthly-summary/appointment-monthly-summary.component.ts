import { Component, OnInit } from '@angular/core';
import { AnalyticsService, MonthlyAppointmentsGroupedDto } from 'src/app/services/analytics.service';
import { Chart, ChartConfiguration, ChartData, ChartType, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-appointment-monthly-summary',
  templateUrl: './appointment-monthly-summary.component.html',
  styleUrls: ['./appointment-monthly-summary.component.scss'],
})
export class AppointmentMonthlySummaryComponent implements OnInit {
  monthlyData: MonthlyAppointmentsGroupedDto[] = [];
  chart: Chart | null = null;

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit(): void {
    this.analyticsService.getAppointmentMonthlyPercentageSummary().subscribe({
      next: (data: MonthlyAppointmentsGroupedDto[]) => {
        this.monthlyData = data;
        console.log('Dados Recebidos:', this.monthlyData);
        this.renderChart();
      },
      error: (error: any) => {
        console.error('Erro ao obter dados de resumo mensal:', error);
      },
    });
  }

  renderChart(): void {
    if (this.chart) {
      this.chart.destroy();
    }

    // Processar os dados para o gráfico
    const labels = this.monthlyData.map(item => `${item.month}/${item.year}`);

    // Obter todos os tipos de pet únicos
    const petTypes = new Set<string>();
    this.monthlyData.forEach(item => {
      item.appointments.forEach(appointment => {
        petTypes.add(appointment.petType);
      });
    });

    // Preparar os datasets para cada tipo de pet
    const datasets = Array.from(petTypes).map(petType => {
      const data = this.monthlyData.map(monthItem => {
        const appointment = monthItem.appointments.find(app => app.petType === petType);
        return appointment ? appointment.percentage : 0;
      });

      return {
        label: petType,
        data,
        fill: false,
        borderColor: this.getRandomColor(),
        backgroundColor: this.getRandomColor(),
        tension: 0.1,
      };
    });

    const chartData: ChartData<'line'> = {
      labels,
      datasets,
    };

    const config: ChartConfiguration<'line'> = {
      type: 'line',
      data: chartData,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Resumo Mensal de Agendamentos por Tipo de Pet (%)',
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            title: {
              display: true,
              text: 'Percentual (%)',
            },
          },
          x: {
            title: {
              display: true,
              text: 'Mês/Ano',
            },
          },
        },
      },
    };

    this.chart = new Chart('monthlyAppointmentChart', config);
  }

  // Método auxiliar para gerar cores aleatórias
  getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
}
