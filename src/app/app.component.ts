import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {


  countriesData: any[];
  convertedData: any;
  loading = false;
  clean = true;
  messageToShow = '';
  form: FormGroup;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    public snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      amount: ['', Validators.required],
      referenceCountry: ['', Validators.required],
      targetCountry: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.http.get('./assets/data.json').subscribe(
      data => {
        console.log(data);
        this.countriesData = Object.values(data);
      },
      error => {
        console.log(error);
        this.snackBar.open('Somthing went wrong :(', 'OK', {
          duration: 3000
        });
      }
    );
  }

  onSubmit() {
    const amount = this.form.value.amount;
    const referenceCountry = this.form.value.referenceCountry;
    const targetCountry = this.form.value.targetCountry;
    console.log(this.form);
    if (this.form.valid) {
      console.log(amount, referenceCountry, targetCountry);
      const conv_str = referenceCountry + '_' + targetCountry;
      this.loading = true;
      this.clean = false;
      this.messageToShow = '';
      this.http
        .get(
          `http://free.currencyconverterapi.com/api/v5/convert?q=${conv_str}&compact=y`
        )
        .subscribe(
          data => {
            this.convertedData = data[conv_str].val * amount;
            const currencyFrom = this.countriesData.filter( key => key.code === referenceCountry );
            const currencyTo = this.countriesData.filter( key => key.code === targetCountry );
            console.log(currencyFrom);
            this.messageToShow = `${ amount }
               ${ amount === 1 ? currencyFrom[0].name : currencyFrom[0].name_plural }
               <br /> = <span class="result-amount">${ this.convertedData }
               ${ this.convertedData === 1 ? currencyTo[0].name : currencyTo[0].name_plural }</span> `;
            this.loading = false;
          },
          error => {
            this.loading = false;
            this.messageToShow = 'Somthing went wron with the API server';
            this.snackBar.open('Could not connect to the API server.', 'OK', {
              duration: 2500
            });
          }
        );
    } else {
      this.snackBar.open('Please fill all fields.', 'ok', {
        duration: 2000
      });
    }
  }
}
// http://free.currencyconverterapi.com/api/v5/convert?q=USD_INR&compact=y
