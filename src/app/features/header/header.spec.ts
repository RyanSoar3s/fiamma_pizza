import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

import { Header } from './header';
import { Responsive } from '@services/responsive';
import { ResponsiveMock } from '@mocks/responsive.mock';

describe('Header', () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ Header ],
      providers: [
        provideRouter([]),
        {
          provide: Responsive,
          useClass: ResponsiveMock
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open menu when menu button is clicked', () => {
    fixture.detectChanges();

    const menuButton = fixture.debugElement.query(
      By.css('button[aria-label="Abrir menu"]')

    );
    expect(menuButton).toBeTruthy();

    menuButton.nativeElement.click();
    fixture.detectChanges();

    const menu = fixture.nativeElement.querySelector('.menu');
    expect(menu).toBeTruthy();
    
  });
});
