import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// const currData = require('./curr_data.json');
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  currData = require('./curr_data.json');
  arrData = Object.values(this.currData);
  constructor(private http: HttpClient) {}
  convertedData: number;
  ngOnInit() {
  }
  onClick(value, con1, con2) {
    if(value.value && con1.value && con2.value){}
    const conv_str = con1.value + '_' + con2.value;
    this.http.get(`http://free.currencyconverterapi.com/api/v5/convert?q=${conv_str}&compact=y`)
    .subscribe((data) => {
      //console.log(data);
      this.convertedData = data[conv_str].val * value.value;
    }, (error) => {
      console.log(error);
    });
    }
  }
//http://free.currencyconverterapi.com/api/v5/convert?q=USD_INR&compact=y
}



