/**
 * @jest-environment jsdom
 */

import { render, screen, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom';
import React from "react";
import { ForecastDataTable } from "@/components/rafed-provider/forecast-data-table";

// Mock fetch
global.fetch = jest.fn();

const mockClassifications = [
    { id: 1, name: "Pharmaceuticals", description: "desc" }
];

const mockForecastTypes = [
    { id: 1, name: "Rafed Forecast", description: "", isEditable: false },
    { id: 2, name: "Provider Forecast", description: "", isEditable: true }
];

const mockForecastData = [
    {
        productId: 101,
        productName: "Aspirin",
        classificationId: 1,
        classificationName: "Pharmaceuticals",
        forecastTypeId: 1,
        value: 100,
        date: "2024-01-01",
    },
    {
        productId: 101,
        productName: "Aspirin",
        classificationId: 1,
        classificationName: "Pharmaceuticals",
        forecastTypeId: 2,
        value: 150,
        date: "2024-01-01",
    }
];

const mockPaginatedResponse = {
    data: mockForecastData,
    pagination: {
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
        hasNext: false,
        hasPrev: false
    }
};

// Setup fetch mock responses
beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockImplementation((url) => {
        if (url?.toString().includes("/api/classifications")) {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockClassifications),
            });
        }

        if (url?.toString().includes("/api/forecast-types")) {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockForecastTypes),
            });
        }

        if (url.toString().includes("/api/forecast-data-complete")) {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockPaginatedResponse),
            });
        }

        return Promise.reject(new Error("Unknown API"));
    });
});

describe("ForecastDataTable", () => {
    it("affiche les données dans la table après chargement", async () => {
        render(<ForecastDataTable />);

        // Attend que les lignes de la table apparaissent
        await waitFor(() => {
            expect(screen.getByText("Aspirin")).toBeInTheDocument();
        });

        expect(screen.getByText("Pharmaceuticals")).toBeInTheDocument();
        expect(screen.getByText("January 2024")).toBeInTheDocument();

        // Vérifie les valeurs de prévision
        expect(screen.getByText("100")).toBeInTheDocument();
        expect(screen.getByText("150")).toBeInTheDocument();
    });
});
