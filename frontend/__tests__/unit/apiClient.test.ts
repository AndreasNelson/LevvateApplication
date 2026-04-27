import { apiClient, setAxiosInstance } from '../../src/services/apiClient';

describe('apiClient', () => {
  const uuid = 'test-uuid';
  let mockInstance: any;

  beforeEach(() => {
    mockInstance = {
        get: jest.fn(),
        post: jest.fn(),
    };
    setAxiosInstance(mockInstance);
  });

  it('should call createClient', async () => {
    const data = { uuid: 'new-uuid' };
    mockInstance.post.mockResolvedValueOnce({ data });
    
    const result = await apiClient.createClient('test@example.com');
    expect(result).toEqual(data);
    expect(mockInstance.post).toHaveBeenCalledWith('/clients', expect.any(Object));
  });

  it('should call getClient', async () => {
    const data = { client: { uuid } };
    mockInstance.get.mockResolvedValueOnce({ data });
    
    const result = await apiClient.getClient(uuid);
    expect(result).toEqual(data);
    expect(mockInstance.get).toHaveBeenCalledWith(`/clients/${uuid}`);
  });

  it('should call getProgress', async () => {
    const data = { currentStep: 1 };
    mockInstance.get.mockResolvedValueOnce({ data });
    
    const result = await apiClient.getProgress(uuid);
    expect(result).toEqual(data);
    expect(mockInstance.get).toHaveBeenCalledWith(`/clients/${uuid}/progress`);
  });

  it('should call submitStep', async () => {
    const data = { success: true };
    mockInstance.post.mockResolvedValueOnce({ data });
    
    const result = await apiClient.submitStep(uuid, 1, { name: 'John' });
    expect(result).toEqual(data);
    expect(mockInstance.post).toHaveBeenCalledWith(`/clients/${uuid}/step/1`, { formData: { name: 'John' } });
  });
});
