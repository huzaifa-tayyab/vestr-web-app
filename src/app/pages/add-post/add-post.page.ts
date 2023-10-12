import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertController,
  IonModal,
  IonSelect,
  PopoverController,
} from '@ionic/angular';
import { format, parseISO } from 'date-fns';
import { ContentChange, QuillEditorComponent } from 'ngx-quill';
import { ModelService } from 'src/app/services/model.service';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.page.html',
  styleUrls: ['./add-post.page.scss'],
})
export class AddPostPage implements OnInit {
  @ViewChild('mySelect2', { static: false }) selectRef2: IonSelect;
  @ViewChild(QuillEditorComponent) editor: QuillEditorComponent;
  @ViewChild(IonModal) modal: IonModal;
  editorInstance: any;
  htmlContent = '*';
  setSize = 'large';
  setCount = 0;
  vestLogin: any;
  isFileUpload = false;
  file_name: any = '';
  file_type: any = '';
  isPosted = false;
  privacy: any = 'public';
  minDate: any;
  darktheme = false;
  maxDate: any;
  isModalOpen = false;
  post_genre = 'general';
  @ViewChild('popover') popover;

  isOpen = false;
  post_uid: any;
  type: any;
  post_cover_image: any;
  showOtherOptions = false;
  cat: any = [];
  category = '';
  sentiment = 'No sentiment';
  searchItem: any;
  dropdownList = [];
  searchString: any = [];

  constructor(
    public router: Router,
    public model: ModelService,
    public alertController: AlertController,
    public popoverController: PopoverController,
    public route: ActivatedRoute,
    private elementRef: ElementRef
  ) {
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.post_uid = params['id'];
        this.type = params['type'];
        this.htmlContent = JSON.parse(localStorage.getItem('editpost'));
        this.getDetailPost();
      } else {
        this.post_uid = '';
        this.type = '';
      }
    });
  }
  getDetailPost() {
    this.model.showspinner();
    this.model
      .common_api(
        'user/post-details',
        {
          // "user_uid":this.vestLogin.user_uid,
          post_uid: this.post_uid,
        },
        'am9obkBleGFtcGxlLmNvbTphYmMxMjM'
      )
      .subscribe((data: any) => {
        this.model.hidespinner();
        if (data.status == 1) {
          console.log(data);
        }
      });
  }
  ionViewDidLeave() {
    this.elementRef.nativeElement.remove();
  }
  ionViewDidEnter() {
    this.vestLogin = JSON.parse(localStorage.getItem('vest_login'));
    setInterval(() => {
      const theme = localStorage.getItem('user-theme');
      if (theme) {
        if (theme === 'dark') {
          this.darktheme = true;
          document.body.setAttribute('color-theme', 'dark');
        } else {
          this.darktheme = false;
          document.body.setAttribute('color-theme', 'light');
        }
      } else {
        this.darktheme = false;
        document.body.setAttribute('color-theme', 'light');
      }
    }, 100);
    this.getAllCategory();
  }
  getEnterData(e) {
    if (e.target.value) {
      this.dropdownList.unshift({ item_text: e.target.value });
      this.searchString.unshift(e.target.value);
      this.searchItem = '';
    }
  }
  removeItem(e) {
    this.dropdownList.splice(e, 1);
  }
  getAllCategory() {
    this.model
      .getData('user/post/categories', 'am9obkBleGFtcGxlLmNvbTphYmMxMjM')
      .subscribe(
        (data: any) => {
          console.log(data);
          if (data.status == 1) {
            this.cat = data.data;
            this.category = this.cat[0].name;
          } else {
            this.model.alerterror(data.message);
          }
        },
        (err: any) => {
          this.isPosted = false;
          this.model.alerterror('System generated errors');
        }
      );
  }
  ngOnInit() {
    this.vestLogin = JSON.parse(localStorage.getItem('vest_login'));
    this.minDate = new Date().toISOString();
    const maxD = new Date();
    this.maxDate = maxD.setMonth(maxD.getMonth() + 1);
    this.maxDate = new Date(this.maxDate).toISOString();
  }

  setFocus(e, editor) {
    this.editorInstance = e;
    let toolbar = e.getModule('toolbar');
    toolbar.addHandler('image', this.imageHandler.bind(this));
    editor.quillEditor.formatText(this.setCount, 1, 'size', this.setSize);
    editor.quillEditor.focus();

    editor.onContentChanged.subscribe((content: ContentChange) => {
      if (this.htmlContent) {
        editor.quillEditor.formatText(
          this.setCount,
          this.htmlContent.length - 1,
          'size',
          this.setSize
        );
      }
    });
    if (!this.post_uid) {
      editor.quillEditor.deleteText(0, 1);
    }
  }
  selectGeneral(e) {
    if (e.detail.value != 'general') {
      this.showOtherOptions = true;
    } else {
      this.showOtherOptions = false;
    }
  }
  uploadFile(e: any) {
    if (e.target.files[0].size / 1024 / 1024 < 1) {
      this.model.showspinner();
      this.isFileUpload = true;
      const formData = new FormData();
      formData.append('file', e.target.files[0]);
      this.model.uploadFile(formData, this.vestLogin.token).subscribe(
        (data) => {
          this.model.hidespinner();
          this.isFileUpload = false;
          //console.log(data);
          if (data.status == 1) {
            this.post_cover_image = data.filename;
          } else {
            this.model.alerterror(data.message);
          }
        },
        (err) => {
          this.model.hidespinner();
          this.isFileUpload = false;
          this.model.alerterror('System generated errors');
        }
      );
    } else {
      this.model.alerterror('Please upload image less than 1MB');
    }
  }
  imageHandler() {
    let data: any = this.editorInstance;
    if (this.editorInstance != null) {
      let range = this.editorInstance.getSelection();
      if (range != null) {
        let input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.addEventListener('change', () => {
          if (input.files != null) {
            let file = input.files[0];
            if (file != null) {
              let dataFile = new FormData();
              dataFile.append('file', file);

              let reader = new FileReader();
              reader.readAsDataURL(file);
              reader.onload = function () {
                if (reader.readyState == 2) {
                  let base64result = reader.result;
                  // data.insertEmbed(range.index, "image", reader.result);
                  // console.log(reader.result);
                }
              };
              this.isFileUpload = true;
              this.model.uploadFile(dataFile, this.vestLogin.token).subscribe(
                (data1) => {
                  this.model.hidespinner();
                  this.isFileUpload = false;
                  console.log(data1);
                  if (data1.status == 1) {
                    this.file_name += data1.filename + ',';
                    console.log(this.file_name);
                    this.file_type = data1.type;
                    data.insertEmbed(
                      range.index,
                      'image',
                      'https://vestr.io/api/uploads/temp/' + data1.filename
                    );
                  } else {
                    this.model.alerterror(data1.message);
                  }
                },
                (err) => {
                  this.model.hidespinner();
                  this.isFileUpload = false;
                  this.model.alerterror('System generated errors');
                }
              );
            }
          }
        });
        input.click();
      }
    }
  }
  setValue(e: any) {
    this.setSize = e.target.value;
    if (this.htmlContent) {
      this.setCount = this.htmlContent.length;
    }
  }
  presentPopover(e: Event) {
    this.popover.event = e;
    this.isOpen = true;
  }
  formatDate(value: any) {
    this.popoverController.dismiss();
    console.log(format(parseISO(value), 'yyyy-MM-dd'));
  }
  setOpenprivacy(isOpen, privacy) {
    this.privacy = privacy;
    this.popoverController.dismiss();
  }
  replaceString(e) {
    return e.replace(/_/g, ' ');
  }
  setItem2() {
    this.selectRef2.open();
  }
  onsubmit(action) {
    if (this.htmlContent) {
      var content = this.htmlContent.replace(/temp/g, 'post/images');
      this.isPosted = true;
      if (this.privacy == 'Select privacy') {
        this.privacy = '';
      }
      if (this.post_uid) {
        if (this.type == 'draft') {
          this.model
            .common_api(
              'user/edit-draft-post',
              {
                user_uid: this.vestLogin.user_uid,
                text: content,
                post_uid: this.post_uid,
                file_name: this.file_name,
                file_type: this.file_type,
                privacy: this.privacy,
                save_as: action,
                post_genre: this.post_genre,
                post_cover_image: this.post_cover_image,
                category: this.category,
                sentiment: this.sentiment,
                tags: this.searchString.toString(),
              },
              this.vestLogin.token
            )
            .subscribe(
              (data: any) => {
                this.isPosted = false;
                console.log(data);
                // this.model.hidespinner();
                if (data.status == 1) {
                  this.htmlContent = '';
                  // this.isModalOpen = false;
                  // this.modal.dismiss(null, 'cancel');
                  setTimeout(() => {
                    this.htmlContent = '*';
                  }, 1000);
                  if (action == 'live') {
                    localStorage.setItem(
                      'isLoadPost',
                      JSON.stringify(data.data)
                    );
                    this.router.navigateByUrl('/');
                    // localStorage.setItem('isLoadPost', JSON.stringify(data.data));
                    // localStorage.setItem('setindex', '0');
                  }
                  if (action == 'draft') {
                    localStorage.setItem(
                      'isLoadPost1',
                      JSON.stringify(data.data)
                    );
                    this.router.navigateByUrl('/app/draft');
                    // localStorage.setItem('isLoadPost1', JSON.stringify(data.data));
                    // localStorage.setItem('setindex1', '0');
                  }

                  this.model.alertsuccess(data.message);
                } else {
                  this.model.alerterror(data.message);
                }
              },
              (err: any) => {
                this.isPosted = false;
                // this.model.hidespinner();
                this.model.alerterror('System generated errors');
              }
            );
        } else {
          this.model
            .common_api(
              'user/edit-post',
              {
                user_uid: this.vestLogin.user_uid,
                text: content,
                post_uid: this.post_uid,
                file_name: this.file_name,
                file_type: this.file_type,
                privacy: this.privacy,
                save_as: action,
                post_cover_image: this.post_cover_image,
                post_genre: this.post_genre,
                category: this.category,
                sentiment: this.sentiment,
                tags: this.searchString.toString(),
              },
              this.vestLogin.token
            )
            .subscribe(
              (data: any) => {
                this.isPosted = false;
                console.log(data);
                // this.model.hidespinner();
                if (data.status == 1) {
                  this.htmlContent = '';
                  // this.isModalOpen = false;
                  // this.modal.dismiss(null, 'cancel');
                  setTimeout(() => {
                    this.htmlContent = '*';
                  }, 1000);
                  if (action == 'live') {
                    localStorage.setItem(
                      'isLoadPost',
                      JSON.stringify(data.data)
                    );
                    this.router.navigateByUrl('/');
                    // localStorage.setItem('isLoadPost', JSON.stringify(data.data));
                    // localStorage.setItem('setindex', '0');
                  }
                  if (action == 'draft') {
                    localStorage.setItem(
                      'isLoadPost1',
                      JSON.stringify(data.data)
                    );
                    this.router.navigateByUrl('/app/draft');
                    // localStorage.setItem('isLoadPost1', JSON.stringify(data.data));
                    // localStorage.setItem('setindex1', '0');
                  }

                  this.model.alertsuccess(data.message);
                } else {
                  this.model.alerterror(data.message);
                }
              },
              (err: any) => {
                this.isPosted = false;
                // this.model.hidespinner();
                this.model.alerterror('System generated errors');
              }
            );
        }
      } else {
        this.model
          .common_api(
            'user/add-post',
            {
              user_uid: this.vestLogin.user_uid,
              text: content,
              file_name: this.file_name,
              file_type: this.file_type,
              privacy: this.privacy,
              post_cover_image: this.post_cover_image,
              action: action,
              post_genre: this.post_genre,
              category: this.category,
              sentiment: this.sentiment,
              tags: this.searchString.toString(),
            },
            this.vestLogin.token
          )
          .subscribe(
            (data: any) => {
              this.isPosted = false;
              console.log(data);
              // this.model.hidespinner();
              if (data.status == 1) {
                this.htmlContent = '';
                // this.isModalOpen = false;
                // this.modal.dismiss(null, 'cancel');
                setTimeout(() => {
                  this.htmlContent = '*';
                }, 1000);
                if (action == 'live') {
                  localStorage.setItem('isLoadPost', JSON.stringify(data.data));
                  this.router.navigateByUrl('/');

                  // localStorage.setItem('setindex', '0');
                }
                if (action == 'draft') {
                  this.router.navigateByUrl('/');
                  // localStorage.setItem('isLoadPost1', JSON.stringify(data.data));
                  // localStorage.setItem('setindex1', '0');
                }

                this.model.alertsuccess(data.message);
              } else {
                this.model.alerterror(data.message);
              }
            },
            (err: any) => {
              this.isPosted = false;
              // this.model.hidespinner();
              this.model.alerterror('System generated errors');
            }
          );
      }
    } else {
      this.model.alerterror('Please insert text here.');
    }
  }
}
