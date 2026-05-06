import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [
    CommonModule

  ],
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class Footer {
  protected readonly footerInfo = [
    {
      title: "fiamma pizza",
      items: [
        "A melhor experiência italiana da cidade diretamente na sua mesa."

      ]

    },
    {
      title: "menu",
      items: [
        "pizzas",
        "bebidas",
        "sobremesas"

      ]

    },
    {
      title: "contato",
      items: [
        "📍 Av. das chamas, 123",
        "📞 (11) 99999-8888"

      ]
    },
    {
      title: "horário",
      items: [
        "Terça a Domingo",
        "18h às 23:30h"

      ]

    }

  ];

}
