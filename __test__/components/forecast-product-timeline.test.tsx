import {render, screen, fireEvent, waitFor, within} from '@testing-library/react';
import {ForecastProductTimeline} from '../../components/rafed-provider/forecast-product-timeline';

beforeEach(() => {
    jest.resetAllMocks();
    global.fetch = jest.fn((url, options) => {
        if (url === '/api/products') {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve([
                    { id: 1, name: 'Paracétamol 500mg' },
                    { id: 2, name: 'Amoxicilline 250mg' },
                ]),
            });
        } else if (url === '/api/forecast-types') {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve([
                    { id: 1, name: 'Historical Data', isEditable: false, color: '#ff7300' },
                    { id: 2, name: 'Provider Forecast', isEditable: true, color: '#82ca9d' },
                ]),
            });
        } else { // @ts-ignore
            if (url.startsWith('/api/forecast-data?productId=')) {
                        return Promise.resolve({
                            ok: true,
                            json: () => Promise.resolve([
                                { date: '2023-01-01', forecastTypeId: 2, value: 100 },
                                { date: '2023-02-01', forecastTypeId: 2, value: 200 },
                            ]),
                        });
                    } else if (url === '/api/forecast-data' && options?.method === 'PUT') {
                        return Promise.resolve({ ok: true });
                    }
        }
        return Promise.reject(new Error('Not found'));
    });
});

describe('<ForecastProductTimeline />', () => {
    it('affiche un spinner de chargement au rendu initial', () => {
        render(<ForecastProductTimeline forecastId="someId" />);
        expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('peuple le dropdown des produits après le chargement', async () => {
        render(<ForecastProductTimeline forecastId="someId" />);
        await waitFor(() => {
            expect(screen.getByRole('combobox')).toBeInTheDocument();
        });
        expect(screen.getByText('Amoxicilline 250mg')).toBeInTheDocument();
    });

    it('rend le tableau des prévisions avec les données correctes', async () => {
        render(<ForecastProductTimeline forecastId="someId" />);
        await waitFor(() => {
            expect(screen.getByText('AMOX-0002')).toBeInTheDocument();
        });

        const rows = screen.getAllByRole('row');
        expect(rows).toHaveLength(3); // 1 ligne d’en-tête + 2 lignes de données

        const firstDataRowCells = within(rows[1]).getAllByRole('cell');
        expect(firstDataRowCells[0]).toHaveTextContent('AMOX-0002');
        expect(firstDataRowCells[1]).toHaveTextContent('Amoxicilline 250mg');
        expect(firstDataRowCells[3]).toHaveTextContent(/janv\. 2023/);
        expect(firstDataRowCells[4]).toHaveTextContent('100');
    });

    it('ouvre la modale d\'édition lors du clic sur une cellule éditable', async () => {
        render(<ForecastProductTimeline forecastId="someId" />);
        await waitFor(() => {
            expect(screen.getByText('AMOX-0002')).toBeInTheDocument();
        });

        const editButton = screen.getByText('100').closest('button');
        fireEvent.click(editButton);

        expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('met à jour les données après sauvegarde dans la modale', async () => {
        render(<ForecastProductTimeline forecastId="someId" />);
        await waitFor(() => {
            expect(screen.getByText('AMOX-0002')).toBeInTheDocument();
        });

        const editButton = screen.getByText('100').closest('button');
        fireEvent.click(editButton);

        const input = screen.getByLabelText(/New Provider Forecast:/i);
        fireEvent.change(input, { target: { value: '150' } });

        const saveButton = screen.getByText(/Save/i);
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(screen.getByText('150')).toBeInTheDocument();
        });
    });

    it('affiche correctement plusieurs types de prévisions', async () => {
        // Mock des données avec plusieurs types de prévisions
        global.fetch = jest.fn((url) => {
            if (url === '/api/forecast-types') {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve([
                        { id: 1, name: 'Historical Data', isEditable: false, color: '#ff7300' },
                        { id: 2, name: 'Provider Forecast', isEditable: true, color: '#82ca9d' },
                        { id: 3, name: 'Rafed Forecast', isEditable: false, color: '#8884d8' },
                    ]),
                });
            } else if (url.startsWith('/api/forecast-data?productId=')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve([
                        { date: '2023-01-01', forecastTypeId: 1, value: 50 },
                        { date: '2023-01-01', forecastTypeId: 2, value: 100 },
                        { date: '2023-01-01', forecastTypeId: 3, value: 150 },
                    ]),
                });
            }
            return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
        });

        render(<ForecastProductTimeline forecastId="someId" />);
        await waitFor(() => {
            expect(screen.getByText('Historical Data')).toBeInTheDocument();
            expect(screen.getByText('Provider Forecast')).toBeInTheDocument();
            expect(screen.getByText('Rafed Forecast')).toBeInTheDocument();
        });

        // Vérification des valeurs dans le tableau
        const rows = screen.getAllByRole('row');
        const firstDataRowCells = within(rows[1]).getAllByRole('cell');
        expect(firstDataRowCells[4]).toHaveTextContent('50');  // Historical Data
        expect(firstDataRowCells[5]).toHaveTextContent('100'); // Provider Forecast
        expect(firstDataRowCells[6]).toHaveTextContent('150'); // Rafed Forecast
    });

    it('met à jour les données lors du changement de produit', async () => {
        // Mock des données pour deux produits
        global.fetch = jest.fn((url) => {
            if (url === '/api/products') {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve([
                        { id: 1, name: 'Paracétamol 500mg' },
                        { id: 2, name: 'Amoxicilline 250mg' },
                    ]),
                });
            } else if (url.startsWith('/api/forecast-data?productId=1')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve([
                        { date: '2023-01-01', forecastTypeId: 2, value: 100 },
                    ]),
                });
            } else if (url.startsWith('/api/forecast-data?productId=2')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve([
                        { date: '2023-01-01', forecastTypeId: 2, value: 200 },
                    ]),
                });
            }
            return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
        });

        render(<ForecastProductTimeline forecastId="someId" />);
        await waitFor(() => {
            expect(screen.getByText('Paracétamol 500mg')).toBeInTheDocument();
        });

        // Simuler un changement dans le dropdown
        const dropdown = screen.getByRole('combobox');
        fireEvent.click(dropdown);
        const option = screen.getByText('Amoxicilline 250mg');
        fireEvent.click(option);

        await waitFor(() => {
            expect(screen.getByText('200')).toBeInTheDocument(); // Nouvelle valeur affichée
        });
    });

    it('affiche et met à jour correctement la modale d\'édition', async () => {
        // Mock des données initiales
        global.fetch = jest.fn((url) => {
            if (url.startsWith('/api/forecast-data?productId=')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve([
                        { date: '2023-01-01', forecastTypeId: 2, value: 100 },
                    ]),
                });
            }
            return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
        });

        render(<ForecastProductTimeline forecastId="someId" />);
        await waitFor(() => {
            expect(screen.getByText('100')).toBeInTheDocument();
        });

        // Ouvrir la modale
        const editButton = screen.getByText('100').closest('button');
        fireEvent.click(editButton);

        // Vérifier la valeur initiale dans la modale
        const input = screen.getByLabelText(/New Provider Forecast:/i);
        expect(input).toHaveValue('100');

        // Modifier la valeur
        fireEvent.change(input, { target: { value: '150' } });

        // Sauvegarder
        const saveButton = screen.getByText(/Save/i);
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(screen.getByText('150')).toBeInTheDocument(); // Nouvelle valeur affichée
        });
    });
    it('gère correctement les erreurs d\'API', async () => {
        // Mock d'une erreur d'API
        global.fetch = jest.fn(() => Promise.reject(new Error('API error')));

        render(<ForecastProductTimeline forecastId="someId" />);
        await waitFor(() => {
            // Vérifier que les données mockées ou un message d'erreur est affiché
            expect(screen.getByText(/Données mockées/i)).toBeInTheDocument(); // ou un message d'erreur spécifique
        });

        // Vérifier que le tableau contient au moins une ligne de données mockées
        const rows = screen.getAllByRole('row');
        expect(rows.length).toBeGreaterThan(1);
    });
});