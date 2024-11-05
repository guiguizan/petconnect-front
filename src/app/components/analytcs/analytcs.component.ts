// analytics.component.ts
import { Component, OnInit } from '@angular/core';

import { Chart, ChartConfiguration, ChartData, ChartType, registerables } from 'chart.js';
import { AnalyticsService, AppointmentSummaryDto, AppointmentSummaryResponseDto } from 'src/app/services/analytics.service';

Chart.register(...registerables);

@Component({
  selector: 'app-analytics',
  templateUrl: './analytcs.component.html',
  styleUrls: ['./analytcs.component.scss']
})
export class AnalytcsComponent implements OnInit {
  appointmentSummaries: AppointmentSummaryDto[] = [];
  overallTotalAppointments: number = 0;
  chart: Chart | null = null;

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit(): void {
    this.analyticsService.getSummaryForAppointments().subscribe({
      next: (data: AppointmentSummaryResponseDto) => {
        this.appointmentSummaries = data.appointmentSummaryDtos;
        this.overallTotalAppointments = data.overallTotalAppointments;
        console.log('Dados Recebidos:', this.appointmentSummaries);
        this.renderChart();
      },
      error: (error: any) => {
        console.error('Error fetching analytics data:', error);
      },
    });
  }
  

  renderChart(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  
    // Agrupar os dados por serviceType
    const aggregatedData = this.appointmentSummaries.reduce((acc, curr) => {
      const serviceType = curr.serviceType;
      if (acc[serviceType]) {
        acc[serviceType] += curr.totalAppointments;
      } else {
        acc[serviceType] = curr.totalAppointments;
      }
      return acc;
    }, {} as { [key: string]: number });
  
    const labels = Object.keys(aggregatedData);
    const data = Object.values(aggregatedData);
  
    const chartData: ChartData<'bar'> = {
      labels,
      datasets: [
        {
          label: 'Total de agendamentos por tipo de serviço',
          data,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    };
  
    const config: ChartConfiguration<'bar'> = {
      type: 'bar',
      data: chartData,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Relatório de agendamentos',
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Tipo de Serviço',
            },
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Total de agendamentos',
            },
          },
        },
      },
    };
  
    this.chart = new Chart('appointmentChart', config);
  }
  
}
