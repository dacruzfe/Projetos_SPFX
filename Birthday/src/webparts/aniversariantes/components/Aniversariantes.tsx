import * as React from 'react';
import styles from './Aniversariantes.module.scss';
import { IAniversariantesProps } from './IAniversariantesProps';
import { IEmployee, IAniversariantesState } from './IAniversariantesState';
import { sp } from '@pnp/sp/presets/all';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

export default class Aniversariantes extends React.Component<IAniversariantesProps, IAniversariantesState> {

  constructor(props: IAniversariantesProps) {
    super(props);

    this.state = {
      employees: []
    };
  }

  public componentDidMount(): void {
    this._getListItems();
  }

  private async _getListItems(): Promise<void> {
    sp.setup({
      spfxContext: this.props.context as any
    });

    try {
      const today = new Date();
      const firstDayOfWeek = new Date(today);
      const dayOfWeek = today.getDay();
      const diffToMonday = (dayOfWeek === 0 ? -7 : 0) - dayOfWeek; // Ajuste para considerar segunda-feira como o primeiro dia
      firstDayOfWeek.setDate(today.getDate() + diffToMonday);

      const lastDayOfWeek = new Date(firstDayOfWeek);
      lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 7); // domingo desta semana

      console.log('First day of week (Monday):', firstDayOfWeek);
      console.log('Last day of week (Sunday):', lastDayOfWeek);

      const items = await sp.web.lists.getByTitle("Aniversariantes")
        .items.select("Data", "Title", "Departamento", "PhotoURL", "WorkEmail")
        .get();

      console.log('All items:', items);

      const employees: IEmployee[] = items
        .map((item: any) => {
          const [day, month] = item.Data.split('/');
          return {
            Data: item.Data,
            Title: item.Title,
            Departamento: item.Departamento,
            PhotoURL: item.PhotoURL ? item.PhotoURL.Url : '',
            WorkEmail: item.WorkEmail,
            Birthday: new Date(today.getFullYear(), parseInt(month) - 1, parseInt(day)) // Adiciona a data de aniversário como objeto Date
          };
        })
        .filter((employee: IEmployee & { Birthday: Date }) => {
          console.log('Employee Birthday:', employee.Birthday);
          return employee.Birthday >= firstDayOfWeek && employee.Birthday <= lastDayOfWeek;
        })
        .sort((a, b) => a.Birthday.getTime() - b.Birthday.getTime()); // Ordena por data

      console.log('Filtered and sorted employees:', employees);

      this.setState({ employees });
    } catch (error) {
      console.error('Error retrieving data:', error);
    }
  }

  public render(): React.ReactElement<IAniversariantesProps> {
    return (
      <div className={styles.Aniversariantes}>
        <div className={styles.container}>
          <h2 className={styles.header}>Feliz aniversário para...</h2>
          {this.state.employees.map((employee, index) => (
            <div key={index} className={styles.employeeCard}>
              <img
                src={employee.PhotoURL ? employee.PhotoURL : `${this.props.context.pageContext.web.absoluteUrl}/_layouts/15/images/PersonPlaceholder.96x96x32.png`}
                alt={employee.Title}
                className={styles.photo}
              />
              <div className={styles.employeeInfo}>
                <div className={styles.name}>
                  {employee.Title}
                  <a href={`mailto:${employee.WorkEmail}`} className={styles.details}>
                    <i className="bi bi-envelope-fill" style={{ marginLeft: '5px', fontSize: '1rem' }}></i> {/* Ícone de envelope do bootstrap-icons */}
                  </a>
                </div>
                <div className={styles.title}>{employee.Departamento}</div>
                <div className={styles.details}>
                  {employee.Data}
                  <i className="fas fa-birthday-cake" style={{ color: '#ff69b4', marginLeft: '5px', fontSize: '1rem' }}></i> {/* Ícone de bolo do Font Awesome */}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
