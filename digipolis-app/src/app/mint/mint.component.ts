import { Component } from '@angular/core';

import axios from "axios";

@Component({
  selector: 'app-mint',
  templateUrl: './mint.component.html',
  styleUrls: ['./mint.component.css']
})
export class MintComponent {

  constructor() {}

  address = "";
  nativeBalance = "";
  tokenBalances = "";

  async ngOnInit(): Promise<void> {
    const { data } = await axios(`http://localhost:3000/mint`);
    this.address = data.address;
    this.nativeBalance = data.nativeBalance;
    this.tokenBalances = data.tokenBalances;
  }

}
