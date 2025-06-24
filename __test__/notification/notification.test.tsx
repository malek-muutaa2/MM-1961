import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useTheme } from '@/components/theme-provider';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { TopNav } from '../../components/top-nav';
import { SidebarProvider } from '../../components/ui/sidebar';
import userEvent from '@testing-library/user-event';

// Mock dependencies
jest.mock('../../components/theme-provider');
jest.mock('next/navigation');
jest.mock('next-auth/react');
jest.mock('../../hooks/useNotifications', () => ({
  useNotifications: jest.fn(() => ({
    notifications: [],
    unreadCount: 0,
    markAsRead: jest.fn(),
    isConnected: false,
  })),
}));


const mockUseTheme = useTheme as jest.MockedFunction<typeof useTheme>;
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockUseSession = useSession as jest.MockedFunction<typeof useSession>;

// Mock notification data
const mockNotifications = [
  {
    id: 1,
    userId: 1,
    typeId: 1,
    title: "Test Notification",
    message: "This is a test notification",
    redirectUrl: null,
    data: null,
    readAt: null,
    created_at: new Date(),
    typeName: "alert"
  }
];
// jest.setup.js or at the top of your test file
jest.mock('@radix-ui/react-dropdown-menu', () => {
  const original = jest.requireActual('@radix-ui/react-dropdown-menu');
  return {
    ...original,
    // Simple mock that removes animations and portal behavior
    DropdownMenuContent: ({ children, ...props }) => (
      <div {...props} style={{ animation: 'none' }}>
        {children}
      </div>
    ),
    DropdownMenuPortal: ({ children }) => children,
  };
});
const mockNotificationTypes = [
  { id: 1, name: "alert" },
  { id: 2, name: "system" }
];

describe('TopNav Component', () => {
  beforeEach(() => {
    mockUseTheme.mockReturnValue({
      theme: 'light',
      setTheme: jest.fn(),
    });
    
    mockUseRouter.mockReturnValue({
      push: jest.fn(),
      refresh: jest.fn(),
      // Add other router methods as needed
    } as any);
    
    mockUseSession.mockReturnValue({
      data: null,
      status: 'unauthenticated',
    } as any);
  });
  global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ notifications: mockNotifications }),
      })
    ) as jest.Mock;
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(
              <SidebarProvider>

      <TopNav 
        countUnread={0} 
        userinfo={null} 
        notificationtypes={mockNotificationTypes} 
      />
            </SidebarProvider>

    );
      expect(screen.getByRole('searchbox')).toBeInTheDocument();

  });

  it('displays unread notification count', () => {
    render(
                      <SidebarProvider>

      <TopNav 
        countUnread={3} 
        userinfo={null} 
        notificationtypes={mockNotificationTypes} 
      />
                  </SidebarProvider>

    );
    
    expect(screen.getByText('3')).toBeInTheDocument();
  });

it('opens and closes notification dropdown', async () => {
  const { container } = render(
    <SidebarProvider>
      <TopNav 
        countUnread={3} 
        userinfo={null} 
        notificationtypes={mockNotificationTypes} 
      />
    </SidebarProvider>
  );

  const button = screen.getByTestId('notifications-button');
  await userEvent.click(button);

  // Debug: Print the entire DOM

  // Look for any evidence the dropdown opened
  const dropdownTitle = await screen.findByText('Notifications', {}, { timeout: 3000 });
  expect(dropdownTitle).toBeInTheDocument();
    const markasread = await screen.findByText('Mark all read', {}, { timeout: 3000 });
  expect(markasread).toBeInTheDocument();


  // Close dropdown
//   await userEvent.click(button);
//   await waitFor(() => {
//     expect(screen.queryByText('Notifications')).not.toBeInTheDocument();
//   });
});

// it('loads notifications when dropdown is first opened', async () => {
//   // Mock the API call to simulate loading
//   global.fetch = jest.fn(() =>
//     Promise.resolve({
//       json: () => Promise.resolve({ notifications: [] }),
//     })
//   ) as jest.Mock;

//   const { container } = render(
//     <SidebarProvider>
//       <TopNav 
//         countUnread={3} 
//         userinfo={{ id: 1 }} // Need userinfo for notifications to load
//         notificationtypes={mockNotificationTypes} 
//       />
//     </SidebarProvider>
//   );
//  console.log("container", container);
 
//    const button = screen.getByTestId('notifications-button');
//   await userEvent.click(button);

//   // Debug: Print the entire DOM

//   // Look for any evidence the dropdown opened
//   const dropdownTitle = await screen.findByText('Notifications', {}, { timeout: 3000 });
//   expect(dropdownTitle).toBeInTheDocument();
    
//   // Check for loading state - use either of these approaches:

//   // Option 1: Look for loading skeletons (if that's what you use)
//   const skeletons = await screen.findAllByTestId('loading-skeleton');
//   expect(skeletons).toBeInTheDocument();



// });

  it('allows switching between notification filters', async () => {
  const { container } = render(
    <SidebarProvider>
      <TopNav 
        countUnread={3} 
        userinfo={{ id: 1 }} // Need userinfo for notifications to load
        notificationtypes={mockNotificationTypes} 
      />
    </SidebarProvider>
  );
 console.log("container", container);
 
   const button = screen.getByTestId('notifications-button');
  await userEvent.click(button);

  // Debug: Print the entire DOM

  // Look for any evidence the dropdown opened
  const dropdownTitle = await screen.findByText('Notifications', {}, { timeout: 3000 });
  expect(dropdownTitle).toBeInTheDocument();
    
    // 2. Find and click the filter icon
  // OR if no accessible name:
  const filterIcons = document.querySelectorAll('.lucide-filter');
  const filterButton = filterIcons[0].closest('button');
  
  if (!filterButton) {
    throw new Error('Filter button not found');
  }
  
  await userEvent.click(filterButton);
    const unreadOption = await screen.findByRole('menuitemradio', { name: /unread/i });
  await userEvent.click(unreadOption);

  // 4. Verify the filter was applied
  await waitFor(() => {
    // Either check for visual changes or API calls
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('unread=true')
    );
  });
});
  it('marks all notifications as read', async () => {
    const mockMarkAllAsRead = jest.fn();
    
    render(
   <SidebarProvider>
      <TopNav 
        countUnread={3} 
        userinfo={{ id: 1 }} // Need userinfo for notifications to load
        notificationtypes={mockNotificationTypes} 
      />
    </SidebarProvider>
    );
    
     const button = screen.getByTestId('notifications-button');
  await userEvent.click(button);

  // Debug: Print the entire DOM

  // Look for any evidence the dropdown opened
  const dropdownTitle = await screen.findByText('Notifications', {}, { timeout: 3000 });
  expect(dropdownTitle).toBeInTheDocument();
    
    const markAllButton = await screen.findByText('Mark all read', {}, { timeout: 3000 });
    fireEvent.click(markAllButton);
    
    // Assert that markAllAsRead was called
    // This might require mocking the API call
  });

  it('changes theme when theme buttons are clicked', async () => {
    const mockSetTheme = jest.fn();
    mockUseTheme.mockReturnValue({
      theme: 'light',
      setTheme: mockSetTheme,
    });
    
    render(
    <SidebarProvider>
      <TopNav 
        countUnread={3} 
        userinfo={{ id: 1 }} // Need userinfo for notifications to load
        notificationtypes={mockNotificationTypes} 
      />
    </SidebarProvider>
    );
    
    const themeButton = screen.getByTestId('theme-button');
  await userEvent.click(themeButton);
    
    const darkButton = await screen.findByText('Dark');
    fireEvent.click(darkButton);
    
    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });



  it('displays "no notifications" message when there are none', async () => {
    // Mock empty notifications
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ notifications: [] }),
      })
    ) as jest.Mock;
    render(
         <SidebarProvider>
      <TopNav 
        countUnread={1} 
        userinfo={{ id: 1 }} // Need userinfo for notifications to load
        notificationtypes={mockNotificationTypes} 
      />
    </SidebarProvider>
    );
    
   const button = screen.getByTestId('notifications-button');
  await userEvent.click(button);
    
    await waitFor(() => {
      expect(screen.getByText('No notifications found')).toBeInTheDocument();
    });
  });
   it('loads and displays notifications when dropdown is opened', async () => {
      global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ notifications: mockNotifications }),
      })
    ) as jest.Mock;
    render(
         <SidebarProvider>
      <TopNav 
        countUnread={1} 
        userinfo={{ id: 1 }} // Need userinfo for notifications to load
        notificationtypes={mockNotificationTypes} 
      />
    </SidebarProvider>
    );
    

    // Open notifications dropdown
    const button = screen.getByTestId('notifications-button');
    await userEvent.click(button);

    // Verify loading state appears
    // expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();

    // Wait for notifications to load
    await waitFor(() => {
      expect(screen.getByText('Test Notification')).toBeInTheDocument();
            expect(screen.getByText('This is a test notification')).toBeInTheDocument();

      expect(screen.queryByTestId('loading-skeleton')).not.toBeInTheDocument();
    });

    // Verify API was called with correct parameters
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/notifications/load?page=1&size=7')
    );
  });
  
  it('shows loading more indicator during pagination', async () => {
    // Mock paginated responses
    global.fetch = jest.fn((url) => {
      const page = url.includes('page=1') ? 1 : 2;
      return Promise.resolve({
        json: () => Promise.resolve({ 
          notifications: page === 1 
            ? Array(7).fill(0).map((_, i) => ({
                id: i+1,
                title: `Notification ${i+1}`,
                message: "Test",
                readAt: null,
                created_at: new Date(),
                typeName: "alert"
              }))
            : [{ 
                id: 8,
                title: "New Notification",
                message: "Loaded later",
                readAt: null,
                created_at: new Date(),
                typeName: "alert"
              }]
        }),
      });
    }) as jest.Mock;

    render(
       <SidebarProvider>
      <TopNav 
        countUnread={1} 
        userinfo={{ id: 1 }} // Need userinfo for notifications to load
        notificationtypes={mockNotificationTypes} 
      />
    </SidebarProvider>
    );

    // Open notifications dropdown
    const button = screen.getByTestId('notifications-button');
    await userEvent.click(button);

    // Wait for initial load
    await screen.findByText('Notification 1');

    // Simulate scroll to trigger pagination
    const scrollArea = screen.getByRole('menu').querySelector('[class*="overflow-y-auto"]');
    if (scrollArea) {
      Object.defineProperty(scrollArea, 'scrollHeight', { value: 1000 });
      Object.defineProperty(scrollArea, 'scrollTop', { value: 800 });
      Object.defineProperty(scrollArea, 'clientHeight', { value: 200 });
      
      fireEvent.scroll(scrollArea);
    }

    // Verify loading more indicator appears
    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();

    // Wait for new items to load
    await waitFor(() => {
      expect(screen.getByText('New Notification')).toBeInTheDocument();
    });
  });
    it('shows end of list indicator when no more notifications', async () => {
    // Mock single page response
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ 
          notifications: Array(3).fill(0).map((_, i) => ({
            id: i+1,
            title: `Notification ${i+1}`,
            message: "Test",
            readAt: null,
            created_at: new Date(),
            typeName: "alert"
          }))
        }),
      })
    ) as jest.Mock;

    render(
       <SidebarProvider>
      <TopNav 
        countUnread={1} 
        userinfo={{ id: 1 }} // Need userinfo for notifications to load
        notificationtypes={mockNotificationTypes} 
      />
    </SidebarProvider>
    );

    // Open notifications dropdown
    const button = screen.getByTestId('notifications-button');
    await userEvent.click(button);

    // Verify end of list message appears
    await waitFor(() => {
      expect(screen.getByText("You've reached the end of your notifications")).toBeInTheDocument();
    });
  });



});