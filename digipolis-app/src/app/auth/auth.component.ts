import { Component } from '@angular/core';

// for navigating to other routes
import { Router } from '@angular/router';

// for making HTTP requests
import axios from 'axios';

import { getDefaultProvider } from 'ethers';
import {
  createClient,
  connect,
  disconnect,
  getAccount,
  signMessage,
  InjectedConnector,
} from '@wagmi/core';

import { environment } from '../../environments/environment';

const client = createClient({
  autoConnect: true,
  provider: getDefaultProvider(),
});



@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {

  session: any;

  constructor(
    private router: Router
  ) {
  }

  async ngOnInit() {
    await this.initAuth();
  }

  async initAuth() {
    try {
      const { data } = await axios.get(
        `${environment.SERVER_URL}/authenticate`,
        {
          withCredentials: true,
        }
      );
  
      const { iat, ...authData } = data; // remove unimportant iat value
  
      this.session = JSON.stringify(authData, null, 2); // format to be displayed nicely
    } catch (err) {
      // if user does not have a "session" token, redirect to /signin
      this.router.navigateByUrl('/');
    }
  }

  async handleAuth() { 

    const { isConnected } = getAccount();

    if (isConnected) await disconnect(); //disconnects the web3 provider if it's already active

    const provider = await connect({ connector: new InjectedConnector() }); // enabling the web3 provider metamask

    const userData = {
      address: provider.account,
      chain: provider.chain.id,
    };

    const { data } = await axios.post(
      `${environment.SERVER_URL}/request-message`,
      userData
    );

    const message = data.message;

    const signature = await signMessage({ message });

    await axios.post(
      `${environment.SERVER_URL}/verify`,
      {
        message,
        signature,
      },
      { withCredentials: true } // set cookie from Express server
    );

    await this.initAuth();

  }

  async signOut() {
    await axios.get(`${environment.SERVER_URL}/logout`, {
      withCredentials: true,
    });
    this.session = undefined;
  }

}
