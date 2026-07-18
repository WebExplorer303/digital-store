import { NextRequest, NextResponse } from 'next/server';
import { dbAdmin, authAdmin } from '@/lib/firebaseAdmin';
import { getMessaging } from 'firebase-admin/messaging';

export async function POST(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('__session')?.value;
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized: Please log in.' }, { status: 401 });
    }

    const decodedClaims = await authAdmin.verifySessionCookie(sessionCookie, true);
    const sellerId = decodedClaims.uid;
    const body = await request.json();
    const { title, description, summary, price, category, imageUrl, downloadUrl } = body;

    if (!title || !description || !price) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    const newProduct = {
      title,
      description,
      summary,
      price,
      category,
      imageUrl: imageUrl || '',
      downloadUrl: downloadUrl || '',
      ownedBy: [sellerId],
      sellerId,
      createdAt: new Date(),
    };

   
    const docRef = await dbAdmin.collection('products').add(newProduct);
    const generatedProductId = docRef.id;

    const notificationMessage = {
      topic: 'new-products',
      notification: {
        title: 'New Asset Listed!',
        body: `${title} is now available in ${category} for $${price}!`,
        image: imageUrl || 'https://picsum.photos/600/400',
      },
      data: {
        productId: generatedProductId,
        sellerId: sellerId,
        clickAction: `/products/${generatedProductId}`,
      },
    };

    getMessaging()
      .send(notificationMessage)
      .then(() => {
        console.log(`Notification sent for topic: new-products`);
      })
      .catch((err) => {
        console.error('FCM send failed (non-critical):', err);
      });

    return NextResponse.json({
      success: true,
      productId: generatedProductId,
      message: 'Product created and alert dispatched!',
    }, { status: 201 });

  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}