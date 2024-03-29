import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { AddCategoryComponent } from '../add-category/add-category.component';
import { MsmsService } from 'src/app/msms.service';
import { DeleteDataComponent } from '../delete-data/delete-data.component';


@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  displayedColumns: string[] = ['cat_id','cat_name','description','action'];
  dataSource = new MatTableDataSource<any>

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  category_data:any
  deletevalue: any = 1

  constructor(
    private dailog: MatDialog,
    private service :MsmsService,
    private router:Router
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = function(){
      return false;
    }
   }

  ngOnInit(): void {
    this.service.get_category().subscribe(
      (category_data:any)=>{
       this.dataSource = new MatTableDataSource(category_data.data);
       this.category_data = category_data.data.length
       this.dataSource.sort = this.sort;
       this.dataSource.paginator = this.paginator

      }
    )
  }

  catogory_edit(row: any) {
    this.dailog.open(AddCategoryComponent, {
      data:row,
    });
  }

  add_party() {
    this.dailog.open(AddCategoryComponent, {
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
        deldata.append('cat_id', row.cat_id);
        this.service.category_delete(deldata).subscribe(
          (res: any) => {
            console.log(res)
            this.router.navigate(['/home/category'])
            alert('Data Delete Successfylly...')
            this.router.navigate(['/home/category'])
          }
        )
      }
      else { }
    });
  }
  

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.category_data = this.dataSource.filteredData.length

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  delete_category(row:any){
    if(confirm('Do you really want to remove it?')){
      const  deletecategory = new FormData();
      deletecategory.append('cat_id',row.cat_id),
      this.service.category_delete(deletecategory).subscribe(
        (res:any) => {
          this.router.navigate(['/home/category']);
        }
      )
    }
  }

}


