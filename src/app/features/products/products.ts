import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-products',
  imports: [
    CommonModule,
    CurrencyPipe

  ],
  templateUrl: './products.html',
  styleUrl: './products.css'
})
export class Products {
  products: Array<{
    title: string,
    items: Array<{
      name: string,
      desc: string,
      price: number

    }>

  }> = [
    {
      title: "title1",
      items: [
        {
          name: "prod1",
          desc: "texto de puro exemplo.",
          price: 20.00

        },
        {
          name: "prod1",
          desc: "texto de puro exemplo.",
          price: 20.00

        },
        {
          name: "prod1",
          desc: "texto de puro exemplo.",
          price: 20.00

        }
,
        {
          name: "prod1",
          desc: "texto de puro exemplo.",
          price: 20.00

        }
,
        {
          name: "prod1",
          desc: "texto de puro exemplo.",
          price: 20.00

        }


      ]

    },
    {
      title: "title1",
      items: [
        {
          name: "prod1",
          desc: "texto de puro exemplo.",
          price: 20.00

        }

      ]

    }

  ];

}
