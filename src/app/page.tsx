import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import CoffeeArsenal from '@/components/CoffeeArsenal';
import Mission from '@/components/Mission';
import Subscription from '@/components/Subscription';
import Impact from '@/components/Impact';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <CoffeeArsenal />
      <Mission />
      <Subscription />
      <Impact />
      <Footer />
    </main>
  );
}
