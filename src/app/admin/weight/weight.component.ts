import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { Route, Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { AddWeightComponent } from '../add-weight/add-weight.component';
import { MsmsService } from 'src/app/msms.service';
import { DeleteDataComponent } from '../delete-data/delete-data.component';


export interface UserData {
  weight_id: number;
  weight: string;
  description: string;
}


@Component({
  selector: 'app-weight',
  templateUrl: './weight.component.html',
  styleUrls: ['./weight.component.css']
})
export class WeightComponent implements OnInit {
  displayedColumns: string[] = ['weight_id','weight','description','action'];
  dataSource!: MatTableDataSource<UserData>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  weight_data:any
  deletevalue: any = 1

  constructor(
    public dialog: MatDialog,  
    private dailog: MatDialog,
    private Service:MsmsService,
    private router:Router
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = function(){
      return false;
    }
  }

  ngOnInit(): void {
    this.Service.get_weight().subscribe(
      (weight_data : any) => {
        this.dataSource = new MatTableDataSource(weight_data.data);
        this.weight_data = weight_data.data.length
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator
      }
    )
  }
  

  course_edit(row: any) {
    this.dailog.open(AddWeightComponent, {
      data: row,
    });
  }

  add_weight() {
    this.dailog.open(AddWeightComponent, {
      disableClose: true
    });
  }
  openDialog(row: any) {
    const dialogRef = this.dailog.open(DeleteDataComponent, {
      data: this.deletevalue,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (this.deletevalue == result) {
        const deldata = new FormData();
        deldata.append('weight_id', row.weight_id);
        this.Service.weight_delete(deldata).subscribe(
          (res: any) => {
            console.log(res)
            alert('Data Delete Successfylly...')
            this.router.navigate(['/home/weight'])
          }
        )
      }
      else { }
    });
  }
  

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.weight_data = this.dataSource.filteredData.length

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  delete_weight(row:any){
    if(confirm('Do you really want to remove it?')){
      const  deleteweight = new FormData();
      deleteweight.append('weight_id',row.weight_id),
      this.Service.weight_delete(deleteweight).subscribe(
        (res:any) => {
          this.router.navigate(['/home/weight']);
        }
      )
    }
  }

}


