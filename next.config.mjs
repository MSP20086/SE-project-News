/** @type {import('next').NextConfig} */
const nextConfig = {images: {
    remotePatterns: [
        {
            protocol: 'https',
            hostname: 'api.time.com',
            port: '',
            pathname: '/wp-content/uploads/**',
        },
        {
            protocol: 'https',
            hostname: 'images.indianexpress.com',
            port: '',
        },
        {
            protocol: 'https',
            hostname: 'source.unsplash.com',
            port: '',

        },
        {
            protocol: 'https',
            hostname: 'lh3.googleusercontent.com',
            port: '',
        }
        
    ],
  },
};

export default nextConfig;
